const API_URL = process.env.DJANGO_API_URL;

export async function fetchFromDjango(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }

  return response.json();
}