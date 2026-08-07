export async function getCandidates() {
  const response = await fetch("/api/v1/candidates");
  return await response.json();
}