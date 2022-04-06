import moment from "moment"

export const PublicSchool = [
  "长江大学",
  "江汉大学",
  "武汉纺织大学",
  "湖北中医药大学",
  "武汉轻工大学",
  "湖北师范大学",
  "湖北民族大学",
  "湖北汽车工业学院",
  "湖北医药学院",
  "湖北经济学院",
  "湖北警官学院",
  "武汉体育学院",
  "湖北文理学院",
  "湖北工程学院",
  "湖北科技学院",
  "黄冈师范学院",
  "湖北理工学院",
  "湖北第二师范学院",
  "荆楚理工学院",
  "武汉商学院",
  "汉江师范学院"
]
export const isPublicSchool = (school: string) => PublicSchool.includes(school)

export const disablePreviousDate = (ts: number) => {
  return ts > moment().subtract({ millisecond: 1000 }).valueOf() || ts < moment('Fri, 01 Apr 2022 00:36:35 GMT').valueOf()
}

export const disabledDateRange = (ts: number) => {
  return ts > moment().valueOf() || ts < moment().subtract({ day: 2 }).valueOf()
}
