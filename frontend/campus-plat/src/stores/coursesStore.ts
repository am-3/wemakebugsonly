import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type Course = {
  id: number;
  title: string;
  completed: boolean;
};

interface StoreState {
  courses: Course[];
  addCourse: (course: Course) => void;
  removeCourse: (courseId: number) => void;
  toggleCourse: (courseId: number) => void;
}

export const useCourseStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        courses: [],
        addCourse: (course) => set((state) => ({ courses: [course, ...state.courses] })),
        removeCourse: (courseId) => set((state) => ({
          courses: state.courses.filter((course) => course.id !== courseId)
        })),
        toggleCourse: (courseId) => set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId ? { ...course, completed: !course.completed } : course
          )
        })),
      }),
      { name: 'courseStore' }
    )
  )
);
