const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

async function request(endpoint, options = {}) {
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'x-auth-token': token } : {}),
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || 'Something went wrong');
  }

  return data;
}

export const authAPI = {
  register: (userData) =>
    request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () => request('/users/me'),
};

export const coursesAPI = {
  getAll: () => request('/courses'),

  getById: (id) => request(`/courses/${id}`),

  create: (courseData) =>
    request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }),
};