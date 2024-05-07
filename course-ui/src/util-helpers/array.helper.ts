export function areArrayEqual<T>(arr1: T[], arr2: T[]) {
  return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
}