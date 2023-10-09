export function classNames(classes: Record<string, boolean>): string {
  return Object.entries(classes).filter(c => c[1]).map(c => c[0]).join(' ');
}
