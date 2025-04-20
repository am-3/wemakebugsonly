from django.urls import path
from django.urls import re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from . import views

schema_view = get_schema_view(
   openapi.Info(
      title="Snippets API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    # Authentication
    path('api/auth/register/', views.RegisterView.as_view(), name='registerStudent'),
    path('api/auth/login/', views.LoginView.as_view(), name='login'),
    path('api/auth/logout/', views.LogoutView.as_view(), name='logout'),
    path('api/auth/refresh/', views.TokenRefreshView.as_view(), name='refresh'),
    # path('api/auth/user/', views.UserDetailView.as_view(), name='user-detail'),

    # Clubs
    path('api/clubs/', views.ClubListCreateView.as_view(), name='club-list'),
    # path('api/clubs/<int:club_id>/', views.ClubDetailView.as_view(), name='club-detail'),
    # path('api/clubs/<int:club_id>/members/', views.ClubMemberListView.as_view(), name='club-members'),
    # path('api/clubs/<int:club_id>/members/<int:user_id>/', views.ClubMemberDetailView.as_view(), name='club-member-detail'),

    # Events
    # path('api/clubs/<int:club_id>/events/', views.EventListCreateView.as_view(), name='club-events'),
    # path('api/events/<int:event_id>/', views.EventDetailView.as_view(), name='event-detail'),
    path('api/events/<int:event_id>/register/', views.EventRegistrationView.as_view(), name='event-register'),
    # path('api/events/<int:event_id>/attendance/<int:user_id>/', views.AttendanceUpdateView.as_view(), name='update-attendance'),

    # Certificates
    # path('api/certificates/', views.CertificateListView.as_view(), name='certificate-list'),
    # path('api/clubs/<int:club_id>/certificates/', views.CertificateCreateView.as_view(), name='certificate-create'),

    # Resources
    # path('api/resources/', views.ResourceListCreateView.as_view(), name='resource-list'),
    # path('api/resources/<int:resource_id>/', views.ResourceDetailView.as_view(), name='resource-detail'),
    path('api/resources/<int:resource_id>/availability/', views.ResourceAvailabilityView.as_view(), name='resource-availability'),
    path('api/resources/<int:resource_id>/bookings/', views.BookingCreateView.as_view(), name='booking-create'),

    # Bookings
    # path('api/bookings/', views.BookingListView.as_view(), name='booking-list'),
    # path('api/bookings/<int:booking_id>/', views.BookingDetailView.as_view(), name='booking-detail'),
    # path('api/bookings/<int:booking_id>/approve/', views.BookingApproveView.as_view(), name='booking-approve'),
    # path('api/bookings/<int:booking_id>/reject/', views.BookingRejectView.as_view(), name='booking-reject'),

    # Courses
    # path('api/courses/', views.CourseListView.as_view(), name='course-list'),
    # path('api/student/courses/', views.StudentCourseListView.as_view(), name='student-courses'),
    path('api/student/performance/', views.StudentPerformanceView.as_view(), name='student-performance'),
    # path('api/courses/<int:course_id>/assessments/', views.AssessmentListCreateView.as_view(), name='assessment-list'),
    # path('api/student/assessments/', views.StudentAssessmentListView.as_view(), name='student-assessments'),
    # path('api/student/grades/', views.StudentGradeListView.as_view(), name='student-grades'),

    # Attendance
    # path('api/attendance-sessions/', views.AttendanceSessionCreateView.as_view(), name='attendance-session-create'),
    # path('api/attendance-sessions/active/', views.ActiveAttendanceSessionListView.as_view(), name='active-attendance-sessions'),
    # path('api/attendance-sessions/<int:session_id>/', views.AttendanceSessionDetailView.as_view(), name='attendance-session-detail'),

    # Facial Recognition
    # path('api/facial-recognition/enroll/', views.FacialEnrollmentView.as_view(), name='facial-enroll'),
    # path('api/attendance/facial/', views.FacialAttendanceView.as_view(), name='facial-attendance'),
    # path('api/attendance/geofencing/', views.GeofencingAttendanceView.as_view(), name='geofencing-attendance'),
    # path('api/attendance/manual/', views.ManualAttendanceView.as_view(), name='manual-attendance'),

    # Attendance Reports
    # path('api/student/attendance/', views.StudentAttendanceView.as_view(), name='student-attendance'),
    # path('api/courses/<int:course_id>/attendance/', views.CourseAttendanceView.as_view(), name='course-attendance'),

    # SWAGGER DOCS
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]


