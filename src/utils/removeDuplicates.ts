export function removeDuplicatePairs(arr: { role: string; name: string }[]) {
  const countMap = new Map();

  arr.forEach((obj) => {
    const key = JSON.stringify({ role: obj.role, name: obj.name });
    countMap.set(key, (countMap.get(key) || 0) + 1);
  });
  return arr.filter((obj) => {
    const key = JSON.stringify({ role: obj.role, name: obj.name });
    return countMap.get(key) === 1;
  });
}
