'use client';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import { LoadingState } from '@/components/layout/LoadingSpinner';
import DashboardStats from '@/components/admin/DashboardStats';
import BookingsList from '@/components/admin/BookingsList';
import { useApi } from '@/hooks/useApi';
import { apiService } from '@/services/api';
import { BookingRequest, Quote } from '@/types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'quotes'>('bookings');

  const {
    data: bookings = [],
    loading: bookingsLoading,
    error: bookingsError,
    refetch: refetchBookings,
  } = useApi<BookingRequest[]>(() => apiService.getBookings(), []);

  const {
    data: quotes = [],
    loading: quotesLoading,
    error: quotesError,
  } = useApi<Quote[]>(() => apiService.getQuotes(), []);

  const loading = bookingsLoading || quotesLoading;
  const error = bookingsError || quotesError;

  const handleStatusChange = async (bookingId: string, status: BookingRequest['status']) => {
    try {
      await apiService.updateBookingStatus(bookingId, status);
      refetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const safeBookings = bookings || [];
  const safeQuotes = quotes || [];

  return (
    <LoadingState loading={loading} error={error || undefined} loadingText="Loading dashboard...">
      <div className="min-h-screen bg-gray-50">
        <Navigation variant="admin" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage bookings and quotes for MapleFresh</p>
          </div>

          {/* Stats */}
          <DashboardStats bookings={safeBookings} quotes={safeQuotes} />

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'bookings'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Bookings ({safeBookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('quotes')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'quotes'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Quotes ({safeQuotes.length})
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'bookings' ? (
                <BookingsList bookings={safeBookings} onStatusChange={handleStatusChange} />
              ) : (
                <div className="space-y-4">
                  {safeQuotes.length === 0 ? (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No quotes yet</h3>
                      <p className="text-gray-600">Quotes will appear here when customers request pricing.</p>
                    </div>
                  ) : (
                    safeQuotes.map((quote) => (
                      <div key={quote.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">Quote #{quote.id.slice(-8)}</h3>
                              <span className="ml-3 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                {quote.status}
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-600">
                              <p><strong>Services:</strong> {quote.services.join(', ')}</p>
                              <p><strong>Property:</strong> {quote.propertyType} ({quote.bedrooms}BR/{quote.bathrooms}BA, {quote.squareFootage} sq ft)</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">${quote.total.toFixed(0)}</p>
                            <p className="text-sm text-gray-500">{formatDate(quote.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LoadingState>
  );
}