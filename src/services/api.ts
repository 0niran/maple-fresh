import { ApiResponse, Quote, BookingRequest, ServiceProvider } from '@/types';
import { QuoteFormData, BookingFormData, ProviderFormData } from '@/types/forms';
import { API_ENDPOINTS } from '@/constants';

class ApiService {
  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  // Quote services
  async createQuote(data: QuoteFormData): Promise<ApiResponse<Quote>> {
    return this.request(API_ENDPOINTS.QUOTES, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getQuotes(): Promise<ApiResponse<Quote[]>> {
    return this.request(API_ENDPOINTS.QUOTES);
  }

  async getQuote(id: string): Promise<ApiResponse<Quote>> {
    return this.request(`${API_ENDPOINTS.QUOTES}/${id}`);
  }

  // Booking services
  async createBooking(data: BookingFormData & {
    subtotal: number;
    bundleDiscount: number;
    taxes: number;
    total: number;
  }): Promise<ApiResponse<BookingRequest>> {
    return this.request(API_ENDPOINTS.BOOKINGS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBookings(): Promise<ApiResponse<BookingRequest[]>> {
    return this.request(API_ENDPOINTS.BOOKINGS);
  }

  async getBooking(id: string): Promise<ApiResponse<BookingRequest>> {
    return this.request(`${API_ENDPOINTS.BOOKINGS}/${id}`);
  }

  async updateBookingStatus(
    id: string,
    status: BookingRequest['status']
  ): Promise<ApiResponse<BookingRequest>> {
    return this.request(`${API_ENDPOINTS.BOOKINGS}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Provider services
  async createProvider(data: ProviderFormData): Promise<ApiResponse<ServiceProvider>> {
    return this.request(API_ENDPOINTS.PROVIDERS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProviders(): Promise<ApiResponse<ServiceProvider[]>> {
    return this.request(API_ENDPOINTS.PROVIDERS);
  }

  async getProvider(id: string): Promise<ApiResponse<ServiceProvider>> {
    return this.request(`${API_ENDPOINTS.PROVIDERS}/${id}`);
  }

  async updateProvider(
    id: string,
    data: Partial<ProviderFormData>
  ): Promise<ApiResponse<ServiceProvider>> {
    return this.request(`${API_ENDPOINTS.PROVIDERS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProvider(id: string): Promise<ApiResponse<void>> {
    return this.request(`${API_ENDPOINTS.PROVIDERS}/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();