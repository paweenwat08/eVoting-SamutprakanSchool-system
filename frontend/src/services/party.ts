export async function getParties() {
  const response = await fetch("/api/v1/parties");
  return await response.json();
}