const PALETTE = [
  '#5B7CFA',
  '#22C55E',
  '#F59E0B',
  '#EF4444',
  '#A855F7',
  '#14B8A6',
  '#EC4899',
  '#3B82F6',
];

export function colorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}

export function initialsFor(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
}
