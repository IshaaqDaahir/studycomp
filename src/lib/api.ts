const API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL;

export async function fetchFromDjango(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Important for session cookies
  });

  // For DELETE requests that return 204 No Content
    if (response.status === 204) {
        return null;
    }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export async function logoutFromDjango() {
  try {
    const response = await fetch(`${API_URL}api/logout/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}