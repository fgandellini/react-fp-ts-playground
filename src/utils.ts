export const log = <T>(message: string) => (arg: T): T => {
  console.log(message, arg)
  return arg
}