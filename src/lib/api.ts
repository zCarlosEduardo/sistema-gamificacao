const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

type FetchOptions = RequestInit & {
  params?: Record<string, string>;
};

export async function api<T = any>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, ...init } = options;

  let url = `${API_URL}${path}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw { status: response.status, ...error };
  }

  return response.json();
}

// Shortcuts
api.get = <T = any>(path: string, params?: Record<string, string>) =>
  api<T>(path, { params });

api.post = <T = any>(path: string, body?: any) =>
  api<T>(path, { method: "POST", body: JSON.stringify(body) });

api.patch = <T = any>(path: string, body?: any) =>
  api<T>(path, { method: "PATCH", body: JSON.stringify(body) });

api.delete = <T = any>(path: string) =>
  api<T>(path, { method: "DELETE" });