export async function listUsers(): Promise<{ users: unknown[] }> {
  return fetch("/users").then((response) => response.json());
}
