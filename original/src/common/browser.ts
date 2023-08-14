export function isMobile(): boolean {
  const ua = navigator.userAgent;
  return ua.includes("Android") || ua.includes("iPhone") || ua.includes("iPad");
}
