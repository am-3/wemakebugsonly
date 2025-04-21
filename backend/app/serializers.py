from .models import User
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
# from django.contrib.auth.models import User
from .models import (
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
    User,
)
from django.utils import timezone
from rest_framework import serializers
from .models import Event


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email',
                  'first_name', 'last_name', 'password', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class AttendanceSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceSession
        fields = ['id', 'course', 'start_time',
                  'end_time', 'status', 'verification_method']


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['id', 'student', 'course', 'date', 'status',
                  'verification_method', 'verification_data']


class FacialRecognitionDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacialRecognitionData
        fields = ['id', 'user', 'face_encoding', 'status']


class AttendanceLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceLog
        fields = ['id', 'attendance', 'log_type', 'log_data', 'timestamp']


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name', 'code', 'credits', 'description']


class StudentCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentCourse
        fields = ['id', 'student', 'course', 'enrollment_date', 'status']


class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = ['id', 'course', 'title',
                  'description', 'max_marks', 'due_date']


class StudentAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAssessment
        fields = ['id', 'student', 'assessment',
                  'marks_obtained', 'submission_date']


class GradeReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = GradeReport
        fields = ['id', 'student', 'course', 'grade', 'date_issued']


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'name', 'resource_type',
                  'capacity', 'location', 'status']


class ResourceBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceBooking
        fields = ['id', 'resource', 'user', 'start_time',
                  'end_time', 'purpose', 'num_attendees', 'status']
        read_only_fields = ['user']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = ['id', 'name', 'description', 'logo', 'creation_date', 'status', 'faculty_advisor', 
                #   'coordinator'
                  ]

class ClubMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClubMembership
        fields = ['id', 'club', 'user', 'role', 'join_date', 'status']


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'club', 'title', 'description', 'date',
                  'location', 'registration_deadline', 'max_participants']
                  


class EventRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventRegistration
        fields = ['id', 'event', 'user',
                  'registration_date', 'attendance_status']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'last_name',
            'roll_no',
            'email',
            'password',
            'profile_picture',
            'role',
            'created_at',
            'updated_at',
        ]
        extra_kwargs = {
            # Prevents password from being returned in responses
            'password': {'write_only': True},
        }

    def validate_password(self, value):
        # Hash the password before storing it.
        return make_password(value)
