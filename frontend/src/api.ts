const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Validation de l'URL pour éviter les attaques SSRF
const validateApiUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    const allowedHosts = ['localhost', '127.0.0.1', 'todopro-api.local'];
    return allowedHosts.includes(parsedUrl.hostname);
  } catch {
    return false;
  }
};

if (!validateApiUrl(API_BASE)) {
  throw new Error('URL API non autorisée');
}

type Credentials = { email: string; password: string };

export async function login(creds: Credentials) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(creds),
      credentials: 'include'
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = 'Erreur de connexion';
      
      if (res.status === 401) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (res.status >= 500) {
        errorMessage = 'Erreur serveur. Veuillez réessayer.';
      } else {
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
      }
      
      throw new Error(errorMessage);
    }
    
    return res.json();
  } catch (error) {
    console.error('Erreur de connexion:', error);
    if (error instanceof TypeError) {
      throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion.');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erreur de réseau inattendue');
  }
}

export async function register(data: { name: string; email: string; password: string; password_confirmation: string }) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = 'Erreur d\'inscription';
      
      if (res.status === 422) {
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.errors) {
            const firstError = Object.values(errorData.errors)[0] as string[];
            errorMessage = firstError[0] || errorMessage;
          }
        } catch {
          errorMessage = 'Données invalides';
        }
      } else {
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
      }
      
      throw new Error(errorMessage);
    }
    
    return res.json();
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    if (error instanceof TypeError) {
      throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion.');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erreur de réseau inattendue');
  }
}

function authHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function fetchTasks(token?: string) {
  const res = await fetch(`${API_BASE}/tasks`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createTask(payload: any, token?: string) {
  const res = await fetch(`${API_BASE}/tasks`, { method: 'POST', headers: authHeaders(token), body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function toggleTask(id: number, token?: string) {
  const res = await fetch(`${API_BASE}/tasks/${id}/toggle`, { method: 'PATCH', headers: authHeaders(token) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateTask(id: number, payload: any, token?: string) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'PUT', headers: authHeaders(token), body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteTask(id: number, token?: string) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE', headers: authHeaders(token) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default API_BASE;
