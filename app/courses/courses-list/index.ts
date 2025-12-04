
import course11 from './course-1-1.json';
import course12 from './course-1-2.json';
import course13 from './course-1-3.json';
import course14 from './course-1-4.json';
import course15 from './course-1-5.json';
import course21 from './course-2-1.json';

export interface Course {
  id?: string;
  name?: string;
  title?: string;
  description?: string;
  level?: string;
  notes?: {
    string: string;
    time: number;
    fret?: number;
  }[];
}

const courses: Course[] = [
  { ...course11 },
  { ...course12 },
  { ...course13 },
  { ...course14 },
  { ...course15 },
  { ...course21 },
];

export function getCourses(): Course[] {
  return courses;
}
