export function propertyOf<T>(name: keyof T) {
  return name.toString();
}