# views.py
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .models import User  # Import your custom User model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
import io
import base64
# import face_recognition  # Would need to be installed
import numpy as np
from PIL import Image
from datetime import datetime
from .serializers import AttendanceSessionSerializer
from .models import AttendanceSession, Attendance, FacialRecognitionData, AttendanceLog
from .serializers import CourseSerializer, AssessmentSerializer, GradeReportSerializer
from .models import Course, StudentCourse, Assessment, StudentAssessment, GradeReport, Attendance
from datetime import datetime, timedelta
from .serializers import ResourceSerializer
# from .serializers import BookingSerializer
from .models import Resource, ResourceBooking
from .serializers import ClubSerializer, EventSerializer
from .models import Club, ClubMembership, Event, EventRegistration
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

from .serializers import UserSerializer

##############################################################################################################################

# Register User (Student, Faculty)
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serialized_user = UserSerializer(data=request.data)
        if serialized_user.is_valid():
            serialized_user.save()
            return Response({'message': 'User has been registered'})
        return Response({'message': serialized_user.errors})


class LoginView(APIView):
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

# views.py


class ClubListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        clubs = Club.objects.all()
        serializer = ClubSerializer(clubs, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Check if user is admin or faculty
        if request.user.role not in ['admin', 'faculty']:
            return Response({
                'error': 'Only admins or faculty can create clubs'
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = ClubSerializer(data=request.data)
        if serializer.is_valid():
            club = serializer.save(faculty_advisor=request.user)

            # Create club membership for creator as president
            ClubMembership.objects.create(
                club=club,
                user=request.user,
                role='president',
                status='active'
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventRegistrationView(APIView):
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
