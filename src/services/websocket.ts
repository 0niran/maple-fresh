// WebSocket service for real-time updates
export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000;
  private listeners: Map<string, Array<(data: unknown) => void>> = new Map();

  constructor(private url: string = 'ws://localhost:3001') {
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.reconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.reconnect();
    }
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private handleMessage(message: { type: string; data: unknown }) {
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach(listener => listener(message.data));
    }
  }

  public subscribe(type: string, callback: (data: unknown) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(type);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  public send(type: string, data: unknown) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Singleton instance
export const webSocketService = new WebSocketService();

// Event types
export const WS_EVENTS = {
  BOOKING_CREATED: 'booking_created',
  BOOKING_UPDATED: 'booking_updated',
  BOOKING_STATUS_CHANGED: 'booking_status_changed',
  QUOTE_CREATED: 'quote_created',
  PROVIDER_STATUS_CHANGED: 'provider_status_changed',
  NOTIFICATION_SENT: 'notification_sent',
} as const;