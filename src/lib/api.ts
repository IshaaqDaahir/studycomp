const API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL;

export async function fetchFromDjango(endpoint: string, options: RequestInit = {}) {
    if (!API_URL) {
        throw new Error('API_URL is not set. Please check your environment variables.');
    }
    
    try {
        // Ensure API_URL ends with a slash
        const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
        const url = new URL(endpoint, baseUrl).toString();
        
        // Get JWT token from localStorage if available
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            credentials: 'include',
            cache: 'no-store', // Disable caching to always get fresh data
        });

        // Read response as text first
        const responseText = await response.text();

        // Handle empty responses
        if (!responseText.trim()) {
            if (response.ok) {
                return null;
            }
            throw new Error(`Empty response from server (${response.status})`);
        }

        // Attempt to parse as JSON
        try {
            const data = JSON.parse(responseText);

            if (!response.ok) {
                if (response.status === 400 && typeof data === 'object') {
                    return Promise.reject(data);
                }
                
                const errorMessage = data.error || data.detail || 'Request failed';
                throw new Error(`${errorMessage} (${response.status})`);
            }

            return data;
        } catch {
            // Check if it's HTML
            if (/^\s*<(!DOCTYPE|html|body)/i.test(responseText)) {
                throw new Error(`(${response.status} ${response.statusText}): ${responseText}`);
            }
            throw new Error(`${responseText}`);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Network request failed');
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
    // Logout error - silently handle for production
    return false;
  }
}