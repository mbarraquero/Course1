export function getTodayMinusYrs(years: number) {
  const todayMinusYrs = new Date();
  todayMinusYrs.setFullYear(todayMinusYrs.getFullYear() - years);
  return todayMinusYrs;
}

export function removeTZ(dateStr?: string) {
  if (!dateStr) return dateStr;
  const date = new Date(dateStr);
  return new Date(date.setMinutes(date.getMinutes() - date.getTimezoneOffset()))
    .toISOString()
    .slice(0, 10);
}