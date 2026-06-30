const API_URL = 'http://localhost:3000/api/auth';


const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    return { ok: response.ok, data };
};


const register = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },   
        body: JSON.stringify(userData)
    });
    const data = await response.json();
    return { ok: response.ok, data: data};
};

const AuthServices = {
    login,
    register
};

export default AuthServices;