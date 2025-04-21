from datetime import datetime, timedelta
import base64
import io
import re
import numpy as np
from PIL import Image

from django.contrib.auth import authenticate
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponseForbidden
from django.contrib.auth.decorators import login_required
from django.utils import timezone

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

# Import models and serializers
from .models import (
    User, Course, StudentCourse, Assessment, StudentAssessment, GradeReport,
    AttendanceSession, Attendance, FacialRecognitionData, AttendanceLog,
    Resource, ResourceBooking,
    Club, ClubMembership, Event, EventRegistration
)

from .serializers import (
    UserSerializer, CourseSerializer, AssessmentSerializer, GradeReportSerializer,
    AttendanceSessionSerializer, ClubMembershipSerializer,
    ResourceSerializer, ClubSerializer, EventSerializer
)
##############################################################################################################################
# Authentication
class RegisterView(APIView):
    ''' 
    Registers a user (Student/Faculty)
    '''
    permission_classes = [AllowAny]

    def post(self, request):
        serialized_user = UserSerializer(data=request.data)
        if serialized_user.is_valid():
            serialized_user.save()
            return Response({'message': 'User has been registered'})
        return Response({'message': serialized_user.errors})


class LoginView(APIView):
    '''
    Checks if the user is logged, if else proceeds to authentication
    '''
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(email=email, password=password)
        if user is not None:
            # Generate a fresh token
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh_token': str(refresh),
                'access_token': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': user.role,
                },
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    '''
    Logs user out and clears tokens
    '''
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Get the refresh token from the request data
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            # Blacklist the refresh token
            token.blacklist()

            return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class TokenRefreshView(APIView):
    """
    Handles refreshing the access token using a valid refresh token.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        # Extract the refresh token from the request
        refresh_token = request.data.get('refresh_token')

        if not refresh_token:
            return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decode the refresh token
            token = RefreshToken(refresh_token)

            # Create a new access token
            new_access_token = token.access_token

            return Response({
                'access_token': str(new_access_token)
            }, status=status.HTTP_200_OK)
        except TokenError as e:
            # Handle invalid or expired refresh tokens
            return Response({'error': 'Invalid or expired refresh token'}, status=status.HTTP_401_UNAUTHORIZED)


##############################################################################################################################
#Clubs
class ClubListCreateView(APIView):
    '''
    CRUD for Clubs
    '''
    permission_classes = [IsAuthenticated]

    def get(self, request):
        club_name = request.GET.get("club_name", None)
        if club_name:
            if Club.objects.filter(name=club_name).exists():
                club = Club.objects.get(name=club_name)
                serializer = ClubSerializer(club)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({"error": f"No club exists with the name: {club_name}"}, status=status.HTTP_404_NOT_FOUND)
        clubs = Club.objects.all()
        serializer = ClubSerializer(clubs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        if request.user.role not in ['admin', 'faculty']:
            return Response({
                'error': 'Only admins or faculty can create clubs'
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = ClubSerializer(data=request.data)
        if serializer.is_valid():
            club = serializer.save(faculty_advisor=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        # Check if user is admin or faculty
        if request.user.role not in ['admin', 'faculty']:
            return Response({
                'error': 'Only admins or faculty can create clubs'
            }, status=status.HTTP_403_FORBIDDEN)

        club = Club.objects.get(faculty_advisor=request.user)

        serializer = ClubSerializer(club, data=request.data, partial=True)
        if serializer.is_valid():
            club = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        if request.user.role not in ['admin', 'faculty']:
            return Response({
                'error': 'Only admins or faculty can delete clubs'
            }, status=status.HTTP_403_FORBIDDEN)

        club_name = request.data['club_name']
        if Club.objects.filter(name=club_name).exists():
            club = Club.objects.get(name=request.data["club_name"])
            club.delete()
            return Response({"message": "Club deleted successfully"}, status=status.HTTP_200_OK)
        return Response({"message": f"No club exist with the name: {club_name}"}, status=status.HTTP_400_BAD_REQUEST)


class ClubMembershipListCreateView(APIView):
    '''
    CRUD for Club members with restricted permissions for operations to coordinators and faculties'''
    def get(self, request):
        club_name = request.GET.get('club_name', None)
        member_roll_no = request.GET.get('member_roll_no', None)
        if club_name:
            if Club.objects.filter(name=club_name).exists():
                club = Club.objects.get(name=club_name)
                club_member_details = ClubMembership.objects.filter(club=club)
                serialized_data = ClubMembershipSerializer(
                    club_member_details, many=True)
                return Response(serialized_data.data)
            return Response({"error": f"No club exists with the name: {club_name}"})
        elif member_roll_no:
            member = User.objects.get(roll_no=member_roll_no)
            club_names = ClubMembership.objects.filter(
                user=member, role='coordinator')
            club_names = club_names.values_list("club__name", flat=True)
            return Response({"club_names": club_names}, status=status.HTTP_200_OK)
        serialized_data = ClubMembershipSerializer(
            ClubMembership.objects.all(), many=True)
        return Response(serialized_data.data)

    def post(self, request):
        if request.user.role not in ['faculty', 'coordinator']:
            return Response({
                'error': 'Only coordinators or faculties can add club members'
            }, status=status.HTTP_403_FORBIDDEN)

        # data = { club, user, role, join_date, status }

        club = request.data.get('club')  # club name
        user = request.data.get('user')  # user id (roll no)

        del request.data['club']
        del request.data['user']

        club = Club.objects.get(name=club)
        user = User.objects.get(roll_no=user)

        request.data['club'] = club.pk
        request.data['user'] = user.pk

        serializer = ClubMembershipSerializer(data=request.data)
        if serializer.is_valid():
            club_member = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        if request.user.role not in ['faculty', 'coordinator']:
            return Response({
                'error': 'Only coordinators or faculties can add club members'
            }, status=status.HTTP_403_FORBIDDEN)

        # data = { club, user, role, join_date, status }

        club = request.data.get('club')  # club name
        user = request.data.get('user')  # user id (roll no)

        del request.data['club']
        del request.data['user']

        club = Club.objects.get(name=club)
        user = User.objects.get(roll_no=user)

        club_membership_obj = ClubMembership.objects.get(club=club, user=user)

        serializer = ClubMembershipSerializer(
            club_membership_obj, data=request.data, partial=True)
        if serializer.is_valid():
            club_member = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        if request.user.role not in ['faculty', 'coordinator']:
            return Response({
                'error': 'Only coordinators or faculties can add club members'
            }, status=status.HTTP_403_FORBIDDEN)

        # data = { club, user, role, join_date, status }

        club = request.data.get('club')  # club name
        user = request.data.get('user')  # user id (roll no)

        del request.data['club']
        del request.data['user']

        club = Club.objects.get(name=club)
        user = User.objects.get(roll_no=user)

        if ClubMembership.objects.filter(club=club, user=user).exists():
            club_membership_obj = ClubMembership.objects.get(
                club=club, user=user)
            club_membership_obj.delete()
            return Response({"message": "User removed successfully"})
        return Response({"message": "User not present in Club"})

##############################################################################################################################
#Events
class EventListCreateView(APIView):
    '''
    GET: List all events
    POST: Create a new event (Only for coordinators and faculty)
    '''
    permission_classes = [IsAuthenticated]

    def get(self, request):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Check if user has permissions to create event (coordinator or faculty)
        if not request.user.has_perm('can_create_event'):
            return Response({'error': 'You do not have permission to create events'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            event = serializer.save(created_by=request.user)
            return Response({
                'message': 'Event created successfully',
                'event': EventSerializer(event).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventDetailUpdateDeleteView(APIView):
    '''
    GET: Retrieve an event
    PUT: Update an event
    DELETE: Delete an event
    '''
    permission_classes = [IsAuthenticated]

    def get(self, request, event_id):
        try:
            event = Event.objects.get(id=event_id)
            serializer = EventSerializer(event)
            return Response(serializer.data)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, event_id):
        try:
            event = Event.objects.get(id=event_id)
            
            # Check if user has permissions to update event (coordinator or faculty)
            if not request.user.has_perm('can_update_event', event):
                return Response({'error': 'You do not have permission to update this event'}, status=status.HTTP_403_FORBIDDEN)

            serializer = EventSerializer(event, data=request.data)
            if serializer.is_valid():
                event = serializer.save()
                return Response({
                    'message': 'Event updated successfully',
                    'event': EventSerializer(event).data
                }, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, event_id):
        try:
            event = Event.objects.get(id=event_id)
            
            # Check if user has permissions to delete event (coordinator or faculty)
            if not request.user.has_perm('can_delete_event', event):
                return Response({'error': 'You do not have permission to delete this event'}, status=status.HTTP_403_FORBIDDEN)

            event.delete()
            return Response({'message': 'Event deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
class EventRegistrationView(APIView):
    '''
    CRUD for Events
    '''
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):
        try:
            event = Event.objects.get(id=event_id)

            # Check if event registration is closed
            if event.registration_deadline and timezone.now() > event.registration_deadline:
                return Response({
                    'error': 'Registration deadline has passed'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Check if event is at capacity
            if event.max_participants:
                current_registrations = EventRegistration.objects.filter(
                    event=event).count()
                if current_registrations >= event.max_participants:
                    return Response({
                        'error': 'Event has reached maximum capacity'
                    }, status=status.HTTP_400_BAD_REQUEST)

            # Check if user is already registered
            existing_registration = EventRegistration.objects.filter(
                event=event,
                user=request.user
            ).first()

            if existing_registration:
                return Response({
                    'error': 'You are already registered for this event'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Create registration
            registration = EventRegistration.objects.create(
                event=event,
                user=request.user,
                attendance_status='registered'
            )

            return Response({
                'message': 'Successfully registered for the event',
                'registration_id': registration.id
            }, status=status.HTTP_201_CREATED)

        except Event.DoesNotExist:
            return Response({
                'error': 'Event not found'
            }, status=status.HTTP_404_NOT_FOUND)


# views.py


class ResourceAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, resource_id):
        try:
            resource = Resource.objects.get(id=resource_id)
            date_str = request.query_params.get('date')

            if not date_str:
                return Response({
                    'error': 'Date parameter is required'
                }, status=status.HTTP_400_BAD_REQUEST)

            try:
                date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return Response({
                    'error': 'Invalid date format. Use YYYY-MM-DD'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Get approved bookings for the date
            bookings = ResourceBooking.objects.filter(
                resource=resource,
                start_time__date=date,
                status='approved'
            )

            # Create time slots (hourly from 9 AM to 6 PM)
            all_slots = []
            start_hour = 9
            end_hour = 18

            for hour in range(start_hour, end_hour):
                slot_start = datetime.combine(
                    date, datetime.min.time().replace(hour=hour))
                slot_end = slot_start + timedelta(hours=1)

                is_available = True
                for booking in bookings:
                    if (slot_start >= booking.start_time and slot_start < booking.end_time) or \
                       (slot_end > booking.start_time and slot_end <= booking.end_time) or \
                       (slot_start <= booking.start_time and slot_end >= booking.end_time):
                        is_available = False
                        break

                all_slots.append({
                    'start_time': slot_start.strftime('%H:%M'),
                    'end_time': slot_end.strftime('%H:%M'),
                    'is_available': is_available and resource.status == 'available'
                })

            return Response({
                'resource': ResourceSerializer(resource).data,
                'date': date_str,
                'time_slots': all_slots
            })

        except Resource.DoesNotExist:
            return Response({
                'error': 'Resource not found'
            }, status=status.HTTP_404_NOT_FOUND)


class BookingCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, resource_id):
        try:
            resource = Resource.objects.get(id=resource_id)

            # Parse start and end times
            try:
                start_time = datetime.strptime(
                    request.data.get('start_time'), '%Y-%m-%d %H:%M')
                end_time = datetime.strptime(
                    request.data.get('end_time'), '%Y-%m-%d %H:%M')
            except ValueError:
                return Response({
                    'error': 'Invalid time format. Use YYYY-MM-DD HH:MM'
                }, status=status.HTTP_400_BAD_REQUEST)

            if start_time >= end_time:
                return Response({
                    'error': 'End time must be after start time'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Check for conflicting bookings
            conflicting_bookings = ResourceBooking.objects.filter(
                resource=resource,
                status='approved',
                start_time__lt=end_time,
                end_time__gt=start_time
            )

            if conflicting_bookings.exists():
                return Response({
                    'error': 'Resource is already booked for this time period'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Create booking
            booking = ResourceBooking.objects.create(
                resource=resource,
                user=request.user,
                start_time=start_time,
                end_time=end_time,
                purpose=request.data.get('purpose'),
                num_attendees=request.data.get('num_attendees', 1),
                status='pending'
            )

            return Response({
                'message': 'Booking request submitted successfully',
                'booking_id': booking.id
            }, status=status.HTTP_201_CREATED)

        except Resource.DoesNotExist:
            return Response({
                'error': 'Resource not found'
            }, status=status.HTTP_404_NOT_FOUND)


# views.py


class StudentPerformanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != 'student':
            return Response({
                'error': 'Only students can access this endpoint'
            }, status=status.HTTP_403_FORBIDDEN)

        # Get all courses the student is enrolled in
        student_courses = StudentCourse.objects.filter(
            student=user, status='active')

        # Calculate GPA and compile course data
        total_credits = 0
        weighted_gpa = 0

        grade_points = {
            'A+': 10, 'A': 9, 'A-': 8.5,
            'B+': 8, 'B': 7, 'B-': 6.5,
            'C+': 6, 'C': 5, 'C-': 4.5,
            'D': 4, 'F': 0
        }

        courses_data = []
        for sc in student_courses:
            course = sc.course

            # Get grade for this course
            grade_report = GradeReport.objects.filter(
                student=user,
                course=course
            ).first()

            # Get assessments for this course
            assessments = StudentAssessment.objects.filter(
                student=user,
                assessment__course=course
            )

            assessment_data = []
            for assessment in assessments:
                assessment_data.append({
                    'title': assessment.assessment.title,
                    'marks_obtained': assessment.marks_obtained,
                    'max_marks': assessment.assessment.max_marks,
                    'percentage': (assessment.marks_obtained / assessment.assessment.max_marks) * 100
                })

            # Get attendance for this course
            attendance_records = Attendance.objects.filter(
                student=user,
                course=course
            )

            total_classes = attendance_records.count()
            present_count = attendance_records.filter(status='present').count()
            attendance_percentage = (
                present_count / total_classes * 100) if total_classes > 0 else 0

            # Calculate GPA contribution
            if grade_report:
                grade = grade_report.grade
                grade_point = grade_points.get(grade, 0)
                weighted_gpa += grade_point * course.credits
                total_credits += course.credits
            else:
                grade = 'N/A'
                grade_point = 0

            courses_data.append({
                'course_code': course.code,
                'course_name': course.name,
                'credits': course.credits,
                'grade': grade,
                'grade_point': grade_point,
                'attendance_percentage': attendance_percentage,
                'assessments': assessment_data
            })

        # Calculate CGPA
        cgpa = (weighted_gpa / total_credits) if total_credits > 0 else 0

        return Response({
            'student': {
                'id': user.id,
                'name': f"{user.first_name} {user.last_name}",
                'email': user.email
            },
            'cgpa': round(cgpa, 2),
            'total_credits': total_credits,
            'courses': courses_data
        })


# views.py


class FacialRecognitionAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        user = request.user

        if user.role != 'student':
            return Response({
                'error': 'Only students can mark attendance'
            }, status=status.HTTP_403_FORBIDDEN)

        try:
            # Get session
            session = AttendanceSession.objects.get(
                id=session_id, status='active')

            if session.verification_method != 'facial_recognition':
                return Response({
                    'error': 'This session does not use facial recognition'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Check if student is enrolled in the course
            student_course = StudentCourse.objects.filter(
                student=user,
                course=session.course,
                status='active'
            ).first()

            if not student_course:
                return Response({
                    'error': 'You are not enrolled in this course'
                }, status=status.HTTP_403_FORBIDDEN)

            # Check if attendance already marked
            existing_attendance = Attendance.objects.filter(
                student=user,
                course=session.course,
                date=datetime.now().date()
            ).first()

            if existing_attendance:
                return Response({
                    'error': 'Attendance already marked for today'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Get user's stored face encoding
            facial_data = FacialRecognitionData.objects.filter(
                user=user,
                status='active'
            ).first()

            if not facial_data:
                return Response({
                    'error': 'Face data not enrolled. Please register your face first.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Process the incoming image
            face_image = request.FILES.get('face_image')
            if not face_image:
                return Response({
                    'error': 'Face image is required'
                }, status=status.HTTP_400_BAD_REQUEST)

            # In a real implementation, we'd compare face encodings here
            # For MVP, we'll simulate success
            is_match = True

            if is_match:
                # Mark attendance
                attendance = Attendance.objects.create(
                    student=user,
                    course=session.course,
                    date=datetime.now().date(),
                    status='present',
                    verification_method='facial_recognition',
                    verification_data={'matched': True}
                )

                # Log success
                AttendanceLog.objects.create(
                    attendance=attendance,
                    log_type='facial_recognition_success',
                    log_details={'session_id': session.id},
                    timestamp=datetime.now()
                )

                return Response({
                    'message': 'Attendance marked successfully',
                    'status': 'present'
                }, status=status.HTTP_200_OK)
            else:
                # Log failure
                AttendanceLog.objects.create(
                    attendance=None,
                    log_type='facial_recognition_failure',
                    log_details={'user_id': user.id, 'session_id': session.id},
                    timestamp=datetime.now()
                )

                return Response({
                    'error': 'Face verification failed. Please try again.'
                }, status=status.HTTP_400_BAD_REQUEST)

        except AttendanceSession.DoesNotExist:
            return Response({
                'error': 'Attendance session not found or not active'
            }, status=status.HTTP_404_NOT_FOUND)
