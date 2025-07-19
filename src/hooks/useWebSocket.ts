import { useEffect, useRef, useCallback } from 'react';
import { webSocketService, WS_EVENTS } from '@/services/websocket';

export function useWebSocket() {
  const isConnected = useRef(false);

  useEffect(() => {
    // Connection is handled by the singleton service
    isConnected.current = true;

    return () => {
      isConnected.current = false;
    };
  }, []);

  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    return webSocketService.subscribe(event, callback);
  }, []);

  const send = useCallback((event: string, data: any) => {
    webSocketService.send(event, data);
  }, []);

  return { subscribe, send, isConnected: isConnected.current };
}

// Specific hooks for different events
export function useBookingUpdates(onBookingUpdate: (booking: any) => void) {
  const { subscribe } = useWebSocket();

  useEffect(() => {
    const unsubscribeCreated = subscribe(WS_EVENTS.BOOKING_CREATED, onBookingUpdate);
    const unsubscribeUpdated = subscribe(WS_EVENTS.BOOKING_UPDATED, onBookingUpdate);
    const unsubscribeStatus = subscribe(WS_EVENTS.BOOKING_STATUS_CHANGED, onBookingUpdate);

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeStatus();
    };
  }, [subscribe, onBookingUpdate]);
}

export function useQuoteUpdates(onQuoteUpdate: (quote: any) => void) {
  const { subscribe } = useWebSocket();

  useEffect(() => {
    const unsubscribe = subscribe(WS_EVENTS.QUOTE_CREATED, onQuoteUpdate);
    return unsubscribe;
  }, [subscribe, onQuoteUpdate]);
}

export function useProviderUpdates(onProviderUpdate: (provider: any) => void) {
  const { subscribe } = useWebSocket();

  useEffect(() => {
    const unsubscribe = subscribe(WS_EVENTS.PROVIDER_STATUS_CHANGED, onProviderUpdate);
    return unsubscribe;
  }, [subscribe, onProviderUpdate]);
}

export function useNotificationUpdates(onNotification: (notification: any) => void) {
  const { subscribe } = useWebSocket();

  useEffect(() => {
    const unsubscribe = subscribe(WS_EVENTS.NOTIFICATION_SENT, onNotification);
    return unsubscribe;
  }, [subscribe, onNotification]);
}