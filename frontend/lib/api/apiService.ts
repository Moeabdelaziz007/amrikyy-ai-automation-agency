/**
 * API Service for Quantum Command Center
 * Handles communication between Frontend and Backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'default-dev-key';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export interface QuantumData {
  status: string;
  timestamp: string;
  metrics: {
    cpu: number;
    memory: number;
    quantum_qubits: number;
  };
}

class ApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.apiKey = API_KEY;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.detail || 'API request failed',
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }

  // Verify API key
  async verifyApiKey(): Promise<ApiResponse> {
    return this.request('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ api_key: this.apiKey }),
    });
  }

  // Get quantum data
  async getQuantumData(): Promise<ApiResponse<QuantumData>> {
    return this.request('/api/quantum-data');
  }

  // Get monitoring data
  async getMonitoringData(): Promise<ApiResponse> {
    return this.request('/api/monitoring/status');
  }

  // Get remediation data
  async getRemediationData(): Promise<ApiResponse> {
    return this.request('/api/remediation/status');
  }

  // Update environment variables for Replit
  updateConfig(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export for Replit environment detection
export const isReplitEnvironment = () => {
  return typeof window !== 'undefined' && 
         (window.location.hostname.includes('replit.dev') || 
          window.location.hostname.includes('repl.co'));
};

// Auto-configure for Replit
if (typeof window !== 'undefined' && isReplitEnvironment()) {
  const replitUrl = `https://${window.location.hostname}`;
  apiService.updateConfig(replitUrl, API_KEY);
}
