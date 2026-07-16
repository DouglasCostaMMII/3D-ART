// In development, Vite proxies /api to localhost:3001
// In production, set VITE_API_URL to your backend URL (e.g. https://my-backend.onrender.com)
export const API_URL = import.meta.env.VITE_API_URL || ''
