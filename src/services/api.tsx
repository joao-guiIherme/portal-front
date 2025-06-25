//const API_BASE_URL = 'https://projeto05-8zfn.onrender.com'; // ou a URL do seu backend
const API_BASE_URL = 'http://localhost:1602'; 
const API_PORTAL = 'http://localhost:8080'; // ou a URL do seu backend
export const fetchSafetyPlaces = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/safetyPlace/get-cnpj`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch safety places');
  }
  return response.json();
};

export const fetchUser = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/user/get-all`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user stats');
  }
  return response.json();
};

export const getUserById = async (token: string) => {
  console.log("Chamando getUserById com token:", token);
  const response = await fetch(`${API_PORTAL}/users/get`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Erro no getUserById:", response.status, errorBody);
    throw new Error('Failed to fetch user by ID');
  }

  return response.json();
};

export const Register = async (token: string, formData: any) => {
  const response = await fetch(`${API_PORTAL}/users/register`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    console.log('Enviando para o backend:', JSON.stringify(formData, null, 2));
    throw new Error('Failed to fetch user by ID');
  }
  return response.json();
}

export const Login = async (formData: any) => {
  const response = await fetch(`${API_PORTAL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.senha  
        })
      });
  if (!response.ok) {
        throw new Error('Usuário ou senha inválidos');
      }
  return response.json();
}     

export const findUserId = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/safetyPlace/getUserFromId/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const responseText = await response.text(); // ⚠️ Lê o corpo uma única vez

  if (!response.ok) {
    console.error(`Erro na resposta da API [${response.status}]:`, responseText);
    throw new Error('Usuário não encontrado');
  }

  try {
    return JSON.parse(responseText); // Tenta converter para JSON
  } catch (err) {
    console.error("Erro ao converter resposta em JSON:", err);
    console.error("Conteúdo da resposta:", responseText);
    throw err;
  }
};



export interface UserUpdateRequest {
  username?: string;
  password?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
}

// Update user
export const updateUser = async (token: string, updates: UserUpdateRequest): Promise<ApiResponse<User>> => {
  const response = await fetch(`${API_PORTAL}/users/update`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Failed to update user: ${response.statusText}`);
  }

  return {
    success: true,
    data: data,
    message: 'Profile updated successfully'
  };
};

// Validar token
export const validateToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return token;
};