class HttpClient {
    constructor() {
        this.requestInterceptors = [];
        this.responseInterceptors = [];
        
        this.interceptors = {
            request: {
                use: (onFulfilled, onRejected) => {
                    this.requestInterceptors.push({ onFulfilled, onRejected });
                    return this.requestInterceptors.length - 1;
                },
                eject: (id) => {
                    this.requestInterceptors[id] = null;
                }
            },
            response: {
                use: (onFulfilled, onRejected) => {
                    this.responseInterceptors.push({ onFulfilled, onRejected });
                    return this.responseInterceptors.length - 1;
                },
                eject: (id) => {
                    this.responseInterceptors[id] = null;
                }
            }
        };
    }

    async request(url, options = {}) {
        let config = { url, ...options };
        for (const interceptor of this.requestInterceptors) {
            if (!interceptor) continue;
            try {
                if (interceptor.onFulfilled) {
                    config = await interceptor.onFulfilled(config) || config;
                }
            } catch (error) {
                if (interceptor.onRejected) {
                    await interceptor.onRejected(error);
                }
                throw error;
            }
        }

        try {
            let response = await fetch(config.url, config);
            let parsedData;
            
            if (response.ok) {
                parsedData = await response.json().catch(() => ({}));
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw { 
                    response, 
                    data: errorData, 
                    message: errorData.status_message || `HTTP Error: ${response.status}` 
                };
            }

            // Executar response interceptors em cadeia (sucesso)
            let result = { response, data: parsedData };
            for (const interceptor of this.responseInterceptors) {
                if (!interceptor) continue;
                if (interceptor.onFulfilled) {
                    result = await interceptor.onFulfilled(result) || result;
                }
            }
            
            return result.data; 

        } catch (error) {
            
            for (const interceptor of this.responseInterceptors) {
                if (!interceptor) continue;
                if (interceptor.onRejected) {
                    
                    error = await interceptor.onRejected(error) || error;
                }
            }
            
            console.error("Erro na requisição HTTP:", error);
            throw error;
        }
    }

    get(url, options = {}) {
        return this.request(url, { ...options, method: 'GET' });
    }

    post(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            },
            body: JSON.stringify(data)
        });
    }

    put(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            },
            body: JSON.stringify(data)
        });
    }

    delete(url, options = {}) {
        return this.request(url, { ...options, method: 'DELETE' });
    }
}

export const http = new HttpClient();

// Mantém retrocompatibilidade para quem usa import { request } from './http.js'
export const request = (url, options) => http.request(url, options);