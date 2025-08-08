const API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL;

export async function fetchFromDjango(endpoint: string, options: RequestInit = {}) {
    if (!API_URL) {
        throw new Error('API_URL is not set. Please check your .env.local and Vercel environment variables.');
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                ...options.headers,
            },
            credentials: 'include',
        });

        // Read response body once as text
        const responseText = await response.text();

        // Check for HTML responses
        if (responseText.startsWith('<!DOCTYPE html>')) {
            throw new Error('Backend returned HTML instead of JSON');
        }

        // Parse response text if it exists
        const data = responseText ? JSON.parse(responseText) : {};

        if (!response.ok) {
            // Handle Django validation errors
            if (response.status === 400 && typeof data === 'object') {
                return Promise.reject(data);
            }
            
            // Use server error message if available
            const errorMessage = data.error || data.detail || 'Request failed';
            throw new Error(`${errorMessage} (${response.status})`);
        }

        return data;
    } catch (error: unknown) {
        // Wrap network errors
        if (error instanceof Error) {
            throw new Error(error.message || 'Network request failed');
        } else {
            throw new Error('Network request failed');
        }
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
  } catch (error: unknown) {
    console.error('Logout error:', error);
    return false;
  }
}