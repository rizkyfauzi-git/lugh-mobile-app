const BASE_URL = 'https://lugh-mobile-backend-v1.vercel.app/api';

export const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const fetchProfile = async () => {
  const response = await fetch(`${BASE_URL}/user/profile`, { headers: getAuthHeader() });
  if (!response.ok) throw new Error('Unauthorized');
  return response.json();
};

export const fetchSummary = async () => {
  const response = await fetch(`${BASE_URL}/transactions/summary`, { headers: getAuthHeader() });
  if (!response.ok) throw new Error('Failed to fetch summary');
  return response.json();
};

export const fetchTransactions = async (type?: string) => {
  const url = type && type !== 'All' ? `${BASE_URL}/transactions?type=${type}` : `${BASE_URL}/transactions`;
  const response = await fetch(url, { headers: getAuthHeader() });
  if (!response.ok) throw new Error('Failed to fetch transactions');
  return response.json();
};

export const fetchWallets = async () => {
  const response = await fetch(`${BASE_URL}/wallets`, { headers: getAuthHeader() });
  if (!response.ok) throw new Error('Failed to fetch wallets');
  return response.json();
};

export const fetchCategories = async () => {
  const response = await fetch(`${BASE_URL}/categories`, { headers: getAuthHeader() });
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};
