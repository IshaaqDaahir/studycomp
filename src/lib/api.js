// const API_URL = process.env.DJANGO_API_URL;
const API_URL = "http://127.0.0.1:8000/";

export async function fetchFromDjango(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    next: { 
      tags: ['django-data'], // For revalidation
      ...options.next 
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }

  return res.json();
}