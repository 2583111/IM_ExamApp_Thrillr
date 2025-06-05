export function getList(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToList(key, id) {
  const arr = getList(key);
  if (!arr.includes(id)) {
    arr.unshift(id);
    localStorage.setItem(key, JSON.stringify(arr));
  }
}
