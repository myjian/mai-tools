export const enum ChartType {
  STANDARD = 0,
  DX = 1,
}

export function getChartType(row: HTMLElement): ChartType {
  if (row.id) {
    // for multi-ChartType songs in song list
    return row.id.includes('sta_') ? ChartType.STANDARD : ChartType.DX;
  }
  const chartTypeImg =
    row.querySelector('.playlog_music_kind_icon') || // for single and all play records
    row.querySelector('.music_kind_icon') || // for song list and friend vs
    row.querySelector('.f_l.h_20') || // for song detail page
    row.querySelector('img:nth-child(2)'); // ancient wisdom for song list

  if (!(chartTypeImg instanceof HTMLImageElement)) {
    return ChartType.DX;
  }
  return chartTypeImg.src.includes('_standard') ? ChartType.STANDARD : ChartType.DX;
}

export function getChartTypeName(ct: ChartType): string {
  return ct === ChartType.DX ? 'DX' : 'STANDARD';
}
