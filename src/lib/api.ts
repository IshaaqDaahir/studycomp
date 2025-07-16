const API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL;

// src/lib/api.ts
export async function fetchFromDjango(endpoint: string, options: RequestInit = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...options.headers,
        },
        credentials: 'include',
        });

        if (response.status === 204) {
            return null;
        }

        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {
            // Use server error message if available
            const errorMessage = data.error || data.detail || 'Request failed';
            throw new Error(`${errorMessage} (${response.status})`);
        }

        return data;
    } catch (error: any) {
        // Wrap network errors
        throw new Error(error.message || 'Network request failed');
    }
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
  } catch (error:any) {
    console.error('Logout error:', error);
    return false;
  }
}