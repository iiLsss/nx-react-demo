export interface BaseAPIRes<T> {
  data?: T
  error_info: {
    errno: number
    error: string
  }
}

/**
 * 接口返回错误码
 */
export enum REQUEST_STATUS {
  SUCCESS = 1,
}

/**
 * 系统预设角色枚举
 */
export enum ESystemRoles {
  // 超级管理员
  ROOT = 1,
  // 校区负责人
  SCHOOL = 2,
  // 学段负责人
  STAGE = 3,
  // 学段学科负责人
  STAGE_SUBJECT = 4,
  // 年级负责人
  GRADE = 5,
  // 年级学科负责人
  GRADE_SUBJECT = 6,
  // 行政班负责人
  ROLE6 = 7,
}
