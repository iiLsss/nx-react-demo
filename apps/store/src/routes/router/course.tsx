import CourseFeedback from '../../pages/CourseManage/CourseFeedback'
import CourseList from '../../pages/CourseManage/CourseList'

const COURSE_ROUTE = {
  path: 'course',
  title: '一级菜单',
  children: [
    {
      path: 'list',
      title: '🎩',
      element: <CourseList />,
    },
    {
      path: 'feedback',
      title: '🎧',
      element: <CourseFeedback />,
    },
  ],
}

export default COURSE_ROUTE
