import axios, { AxiosResponse } from 'axios'
import { API_CODE } from '../constants/statusCode'
import { Userinfo } from '../types/user'
interface Response<T> {
  code: number
  data: T
}

type GetUserInfo = () => Promise<Userinfo>

export const getUserInfo: GetUserInfo = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        'https://mock.mengxuegu.com/mock/638450179433403d6c068829/nx/userinfo'
      )
      .then((res: AxiosResponse<Response<Userinfo>, null>) => {
        if (res.data.code === API_CODE.SUCCESS) {
          resolve(res.data.data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  })
}
