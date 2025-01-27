export function localStorageSet(key: string, value: any) {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
}

export function localStorageGet<T>(key: string) {
    const strValue = localStorage.getItem(key);
    if (strValue !== null)
        return JSON.parse(strValue) as T;
    return null;
}