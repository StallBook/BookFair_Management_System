
export function setLocalStorageData(key: string, data: any): void {
  localStorage.setItem(key, data);
}

export function getLocalStoragedata(key: string): string | null {
  const data = localStorage.getItem(key);
  return data !== null ? <string>(data) : null;
}
