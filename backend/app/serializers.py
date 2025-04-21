from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from django.utils import timezone

# Models
from .models import (
    User,
    AttendanceSession,
    Attendance,
    FacialRecognitionData,
    AttendanceLog,
    Course,
    StudentCourse,
    Assessment,
    StudentAssessment,
    GradeReport,
    Resource,
    ResourceBooking,
    Club,
    ClubMembership,
    Event,
    EventRegistration,
)


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model to handle user registration and management.
    It includes password hashing and provides a representation of the user fields.
    """
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'role']

    def create(self, validated_data):
        """
        Creates a new user instance with hashed password and other fields.
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class AttendanceSessionSerializer(serializers.ModelSerializer):
    """
    Serializer for AttendanceSession model to manage the details of each session
    where attendance is recorded for a particular course.
    """
    class Meta:
        model = AttendanceSession
        fields = ['id', 'course', 'start_time', 'end_time', 'status', 'verification_method']


class AttendanceSerializer(serializers.ModelSerializer):
    """
    Serializer for Attendance model to record the attendance status of a student
    for a particular session and course.
    """
    class Meta:
        model = Attendance
        fields = ['id', 'student', 'course', 'date', 'status', 'verification_method', 'verification_data']


class FacialRecognitionDataSerializer(serializers.ModelSerializer):
    """
    Serializer for FacialRecognitionData model to manage and store facial encoding data for a user.
    """
    class Meta:
        model = FacialRecognitionData
        fields = ['id', 'user', 'face_encoding', 'status']


class AttendanceLogSerializer(serializers.ModelSerializer):
    """
    Serializer for AttendanceLog model to record logs related to attendance verification
    (e.g., facial recognition, geofencing).
    """
    class Meta:
        model = AttendanceLog
        fields = ['id', 'attendance', 'log_type', 'log_data', 'timestamp']


class CourseSerializer(serializers.ModelSerializer):
    """
    Serializer for Course model to represent courses with attributes such as
    name, code, description, and credits.
    """
    class Meta:
        model = Course
        fields = ['id', 'name', 'code', 'credits', 'description']


class StudentCourseSerializer(serializers.ModelSerializer):
    """
    Serializer for StudentCourse model to represent the association between students and courses,
    including their enrollment date and status.
    """
    class Meta:
        model = StudentCourse
        fields = ['id', 'student', 'course', 'enrollment_date', 'status']


class AssessmentSerializer(serializers.ModelSerializer):
    """
    Serializer for Assessment model to represent assessments for courses,
    including details such as title, description, and due date.
    """
    class Meta:
        model = Assessment
        fields = ['id', 'course', 'title', 'description', 'max_marks', 'due_date']


class StudentAssessmentSerializer(serializers.ModelSerializer):
    """
    Serializer for StudentAssessment model to track the marks obtained by a student in an assessment
    along with submission details.
    """
    class Meta:
        model = StudentAssessment
        fields = ['id', 'student', 'assessment', 'marks_obtained', 'submission_date']


class GradeReportSerializer(serializers.ModelSerializer):
    """
    Serializer for GradeReport model to represent the grade reports for students,
    including course, grade, and the date the report was issued.
    """
    class Meta:
        model = GradeReport
        fields = ['id', 'student', 'course', 'grade', 'date_issued']


class ResourceSerializer(serializers.ModelSerializer):
    """
    Serializer for Resource model to manage and represent resources (like classrooms or equipment),
    including their capacity, location, and status.
    """
    class Meta:
        model = Resource
        fields = ['id', 'name', 'resource_type', 'capacity', 'location', 'status']


class ResourceBookingSerializer(serializers.ModelSerializer):
    """
    Serializer for ResourceBooking model to manage resource booking by users,
    including start time, end time, and purpose of the booking.
    """
    class Meta:
        model = ResourceBooking
        fields = ['id', 'resource', 'user', 'start_time', 'end_time', 'purpose', 'num_attendees', 'status']
        read_only_fields = ['user']

    def create(self, validated_data):
        """
        Automatically assigns the logged-in user to the resource booking.
        """
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ClubSerializer(serializers.ModelSerializer):
    """
    Serializer for Club model to represent the details of a club including its name, description,
    logo, and faculty advisor.
    """
    class Meta:
        model = Club
        fields = ['id', 'name', 'description', 'logo', 'creation_date', 'status', 'faculty_advisor']


class ClubMembershipSerializer(serializers.ModelSerializer):
    """
    Serializer for ClubMembership model to represent the relationship between users and clubs,
    including membership roles and status.
    """
    class Meta:
        model = ClubMembership
        fields = ['id', 'club', 'user', 'role', 'join_date', 'status']


class EventSerializer(serializers.ModelSerializer):
    """
    Serializer for Event model to manage event details such as club association, title, description,
    date, location, and registration deadline.
    """
    class Meta:
        model = Event
        fields = ['id', 'club', 'title', 'description', 'date', 'location', 'registration_deadline', 'max_participants']


class EventRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for EventRegistration model to track users who have registered for an event,
    along with registration date and attendance status.
    """
    class Meta:
        model = EventRegistration
        fields = ['id', 'event', 'user', 'registration_date', 'attendance_status']


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model, used for user details management, including password hashing
    and preventing the password field from being returned in responses.
    """
    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'last_name', 'roll_no', 'email', 'password', 'profile_picture', 
            'role', 'created_at', 'updated_at',
        ]
        extra_kwargs = {
            'password': {'write_only': True},  # Prevents password from being returned in responses
        }

    def validate_password(self, value):
        """
        Hashes the password before storing it in the database.
        """
        return make_password(value)
