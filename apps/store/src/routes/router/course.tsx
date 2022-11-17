import CourseFeedback from '../../pages/CourseManage/CourseFeedback'
import CourseList from '../../pages/CourseManage/CourseList'

const COURSE_ROUTE = {
  path: 'course',
  title: '课程管理',
  children: [
    {
      path: 'list',
      title: '列表',
      element: <CourseList />,
    },
    {
      path: 'feedback',
      title: '反馈',
      element: <CourseFeedback />,
    },
  ],
}

export default COURSE_ROUTE
