export async function loadUser(userId: number) {
  const response = await fetch(`/users/${userId}`);
  return (await response.json()) as { id: number; displayName: string };
}
