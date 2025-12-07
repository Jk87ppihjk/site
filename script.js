const API_URL = 'https://sitequevendesites.onrender.com';

// --- Auth Helpers ---
function getToken() {
    return localStorage.getItem('token');
}

function saveToken(token, role) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = 'index.html';
}

function isLoggedIn() {
    return !!getToken();
}

// --- API Wrapper ---
async function apiCall(endpoint, method = 'GET', body = null, isFormData = false) {
    const headers = {};
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (!isFormData) headers['Content-Type'] = 'application/json';

    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = isFormData ? body : JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Something went wrong');
        return data;
    } catch (error) {
        alert(error.message);
        throw error;
    }
}

// --- UI Helpers ---
function updateNav() {
    const navLinks = document.getElementById('nav-links');
    if (isLoggedIn()) {
        navLinks.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="sell.html">Vender Site</a></li>
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="#" onclick="logout()">Sair</a></li>
        `;
    } else {
        navLinks.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="auth.html">Login / Cadastro</a></li>
        `;
    }
}

// --- Page Specific Logic ---
document.addEventListener('DOMContentLoaded', () => {
    updateNav();
});
