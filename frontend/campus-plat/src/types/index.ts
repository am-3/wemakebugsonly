export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'faculty' | 'admin';
  profile_picture?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  club_id?: number;
  club_name?: string;
  max_participants?: number;
  registered_count?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Resource {
  id: number;
  name: string;
  type: string;
  location: string;
  capacity: number;
  description: string;
  amenities?: string[];
  status: 'available' | 'occupied' | 'maintenance';
  image?: string;
}

export interface ResourceBooking {
  id: number;
  resource_id: number;
  user_id: number;
  resource_name?: string;
  start_time: string;
  end_time: string;
  purpose: string;
  num_attendees: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
}

export interface Club {
  id: number;
  name: string;
  description: string;
  logo?: string;
  status: 'active' | 'inactive';
  member_count: number;
  faculty_advisor?: string;
  faculty_advisor_id?: number;
  president?: string;
  president_id?: number;
}

export interface ClubMember {
  id: number;
  club_id: number;
  user_id: number;
  role: 'member' | 'president' | 'secretary' | 'treasurer';
  join_date: string;
  status: 'active' | 'inactive';
  user?: {
    name: string;
    email: string;
    profile_picture?: string;
  }
}

export interface CoursePerformance {
  id: number;
  course_code: string;
  name: string;
  credits: number;
  grade: string;
  grade_point: number;
  attendance: number;
}

export interface AttendanceRecord {
  course_code: string;
  name: string;
  present: number;
  absent: number;
  total: number;
  percentage: number;
}

export interface AcademicPerformance {
  cgpa: number;
  total_credits: number;
  courses: CoursePerformance[];
  attendance: AttendanceRecord[];
}
