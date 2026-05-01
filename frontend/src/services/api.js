const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getHeaders(isFormData = false) {
    const token = localStorage.getItem('atletatrack_token');
    const headers = {};
    if (!isFormData) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  async request(method, path, body = null, isFormData = false) {
    const options = {
      method,
      headers: this.getHeaders(isFormData),
    };
    if (body) options.body = isFormData ? body : JSON.stringify(body);

    const response = await fetch(`${this.baseUrl}${path}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro na requisição');
    }
    return data;
  }

  // Auth
  login(email, password) {
    return this.request('POST', '/auth/login', { email, password });
  }
  register(name, email, password) {
    return this.request('POST', '/auth/register', { name, email, password });
  }
  me() {
    return this.request('GET', '/auth/me');
  }

  // Athletes
  getAthletes(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request('GET', `/athletes?${query}`);
  }
  getAthlete(id) {
    return this.request('GET', `/athletes/${id}`);
  }
  getStats() {
    return this.request('GET', '/athletes/stats/summary');
  }

  // Alerts
  getAlerts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request('GET', `/alerts?${query}`);
  }
  markAlertRead(id) {
    return this.request('PATCH', `/alerts/${id}/read`);
  }

  // Import
  importXlsx(file) {
    const form = new FormData();
    form.append('file', file);
    return this.request('POST', '/import/xlsx', form, true);
  }

  // Health
  health() {
    return this.request('GET', '/health');
  }
}

export default new ApiService();
