export function isToday(day:number): boolean {
  const now = new Date();
  return now.getDate() === day;
}