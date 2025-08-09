const API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL;

export async function fetchFromDjango(endpoint: string, options: RequestInit = {}) {
    if (!API_URL) {
        throw new Error('API_URL is not set. Please check your environment variables.');
    }
    
    try {
        const url = new URL(endpoint, API_URL).toString();
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
            },
            credentials: 'include',
        });

        // Read response as text first
        const responseText = await response.text();

        // Detect HTML responses more robustly
        const isHtml = /^\s*<(!DOCTYPE|html|body)/i.test(responseText);
        if (isHtml) {
            // Extract status text for better error messages
            const statusText = response.statusText || 'Unknown Error';
            throw new Error(`Backend returned HTML (${response.status} ${statusText}): ${responseText.slice(0, 100)}...`);
        }

        // Handle empty responses
        if (!responseText.trim()) {
            if (response.ok) {
                return null; // Successful empty response
            }
            throw new Error(`Empty response from server (${response.status})`);
        }

        // Attempt to parse as JSON
        try {
            const data = JSON.parse(responseText);

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
        } catch {
            // JSON parsing failed - throw with server response snippet
            throw new Error(`Invalid JSON response: ${responseText.slice(0, 100)}...`);
        }
    } catch (error: unknown) {
        // Improve error messages
        if (error instanceof Error) {
            // Preserve original error message
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
    console.error('Logout error:', error);
    return false;
  }
}