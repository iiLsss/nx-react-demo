export const API_RUL = process.env['NX_API_URL']
console.log(process.env)

export const IS_PROD = process.env['NX_ENV'] === 'prod'
export const IS_TEST = process.env['NX_ENV'] === 'test'
export const IS_DEV = process.env['NX_ENV'] === 'dev'

console.log('IS_PROD', IS_PROD)
console.log('IS_TEST', IS_TEST)
console.log('IS_DEV', IS_DEV)
