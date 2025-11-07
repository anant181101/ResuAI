export function truncate(str = '', max = 120) {
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}
