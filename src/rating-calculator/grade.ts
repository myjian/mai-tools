const GRADES_DX = [
  {title: ""},
  {title: "初心者"},
  {title: "見習い"},
  {title: "駆け出し"},
  {title: "修行中"},
  {title: "初段"},
  {title: "二段"},
  {title: "三段"},
  {title: "四段"},
  {title: "五段"},
  {title: "六段"},
  {title: "七段"},
  {title: "八段"},
  {title: "九段"},
  {title: "十段"},
  {title: "皆伝"},
  {title: "壱皆伝"},
  {title: "弐皆伝"},
  {title: "参皆伝"},
  {title: "肆皆伝"},
  {title: "伍皆伝"},
  {title: "陸皆伝"},
  {title: "漆皆伝"},
  {title: "捌皆伝"},
  {title: "玖皆伝"},
  {title: "拾皆伝"},
];

export function getGradeByIndex(index: number) {
  return GRADES_DX[index];
}
