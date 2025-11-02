"use client"

import { useQuery } from "@tanstack/react-query"
import { Icon } from "@iconify/react"
import { Badge } from "@/components/ui/badge"

// Icon components using Boxicons (rounded, thin weight)
const BookOpen = (props: any) => <Icon icon="bx:book" {...props} />
const Users = (props: any) => <Icon icon="bx:group" {...props} />
const Building2 = (props: any) => <Icon icon="bx:building" {...props} />

export function SuperAdminRecentCourses() {
  // API call commented out - using mock data
  const { data: courses, isLoading } = useQuery({
    queryKey: ["super-admin-recent-courses"],
    queryFn: async () => {
      return [
        {
          id: "course1",
          title: "Introduction to Computer Science",
          code: "CS101",
          summary: "Learn the fundamentals of programming and computer science",
          instructor: { firstName: "Dr. Jane", lastName: "Smith" },
          organization: { id: "org1", name: "University of Technology" },
          enrollments: 125,
          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
          createdAt: "2024-01-20T10:00:00Z",
        },
        {
          id: "course2",
          title: "Data Structures and Algorithms",
          code: "CS201",
          summary: "Master data structures and algorithmic problem solving",
          instructor: { firstName: "Prof. John", lastName: "Doe" },
          organization: { id: "org2", name: "State University" },
          enrollments: 98,
          image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop",
          createdAt: "2024-01-18T10:00:00Z",
        },
        {
          id: "course3",
          title: "Web Development Fundamentals",
          code: "WEB101",
          summary: "Build modern web applications with HTML, CSS, and JavaScript",
          instructor: { firstName: "Dr. Sarah", lastName: "Johnson" },
          organization: { id: "org1", name: "University of Technology" },
          enrollments: 156,
          image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
          createdAt: "2024-01-15T10:00:00Z",
        },
        {
          id: "course4",
          title: "Machine Learning Basics",
          code: "ML101",
          summary: "Introduction to machine learning algorithms and applications",
          instructor: { firstName: "Prof. Michael", lastName: "Chen" },
          organization: { id: "org3", name: "Tech Institute" },
          enrollments: 87,
          image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
          createdAt: "2024-01-12T10:00:00Z",
        },
        {
          id: "course5",
          title: "Database Systems",
          code: "DB301",
          summary: "Design and implement efficient database systems",
          instructor: { firstName: "Dr. Emily", lastName: "Williams" },
          organization: { id: "org2", name: "State University" },
          enrollments: 112,
          image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop",
          createdAt: "2024-01-10T10:00:00Z",
        },
        {
          id: "course6",
          title: "Mobile App Development",
          code: "MOB201",
          summary: "Create native and cross-platform mobile applications",
          instructor: { firstName: "Prof. David", lastName: "Brown" },
          organization: { id: "org1", name: "University of Technology" },
          enrollments: 134,
          image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
          createdAt: "2024-01-08T10:00:00Z",
        },
      ]
    },
  })

  if (isLoading) {
    return (
      <div className="px-4 md:px-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card bg-white dark:bg-card w-full rounded-lg overflow-hidden border animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="card-body p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 md:px-6">
      <h2 className="text-2xl font-semibold mb-4">Recent Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses?.map((course: any) => (
          <div key={course.id} className="card bg-white dark:bg-card w-full rounded-lg overflow-hidden border">
            <figure className="m-0">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            </figure>
            <div className="card-body p-4">
              <h2 className="card-title text-lg font-semibold flex items-center justify-between mb-2">
                <span className="line-clamp-2">{course.title}</span>
                <Badge variant="secondary" className="ml-2 shrink-0">NEW</Badge>
              </h2>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.summary}</p>
              <div className="card-actions justify-end mt-2 mb-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {course.code}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {course.enrollments}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                <Building2 className="h-3 w-3" />
                {course.organization.name}
              </div>
              <div className="text-xs text-muted-foreground">
                Instructor: {course.instructor.firstName} {course.instructor.lastName}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

