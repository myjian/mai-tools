const GRADES_DX = [
  {title: "", bonus: 0},
  {title: "初心者", bonus: 0},
  {title: "見習い", bonus: 250},
  {title: "駆け出し", bonus: 500},
  {title: "修行中", bonus: 750},
  {title: "初段", bonus: 1000},
  {title: "二段", bonus: 1200},
  {title: "三段", bonus: 1400},
  {title: "四段", bonus: 1500},
  {title: "五段", bonus: 1600},
  {title: "六段", bonus: 1700},
  {title: "七段", bonus: 1800},
  {title: "八段", bonus: 1850},
  {title: "九段", bonus: 1900},
  {title: "十段", bonus: 1950},
  {title: "皆伝", bonus: 2000},
  {title: "壱皆伝", bonus: 2010},
  {title: "弐皆伝", bonus: 2020},
  {title: "参皆伝", bonus: 2030},
  {title: "肆皆伝", bonus: 2040},
  {title: "伍皆伝", bonus: 2050},
  {title: "陸皆伝", bonus: 2060},
  {title: "漆皆伝", bonus: 2070},
  {title: "捌皆伝", bonus: 2080},
  {title: "玖皆伝", bonus: 2090},
  {title: "拾皆伝", bonus: 2100},
];

export function getGradeByIndex(index: number) {
  return GRADES_DX[index];
}
