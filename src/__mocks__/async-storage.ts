const mockAsyncStorage: Record<string, string> = {};

export async function setItem(key: string, value: string): Promise<void> {
  mockAsyncStorage[key] = value;
}

export async function getItem(key: string): Promise<string | null> {
  return mockAsyncStorage[key] || null;
}
