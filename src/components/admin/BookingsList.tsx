import { Users } from 'lucide-react';
import { BookingRequest } from '@/types';
import { BOOKING_STATUSES } from '@/constants';

interface BookingsListProps {
  bookings: BookingRequest[];
  onStatusChange?: (bookingId: string, status: BookingRequest['status']) => void;
}

export default function BookingsList({ bookings, onStatusChange }: BookingsListProps) {
  const getStatusColor = (status: string) => {
    const statusConfig = BOOKING_STATUSES.find(s => s.value === status);
    return statusConfig?.color || 'bg-gray-100 text-gray-800';
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

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
        <p className="text-gray-600">Bookings will appear here when customers submit requests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {booking.customer.firstName} {booking.customer.lastName}
                </h3>
                <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p><strong>Email:</strong> {booking.customer.email}</p>
                  <p><strong>Phone:</strong> {booking.customer.phone}</p>
                  <p><strong>Address:</strong> {booking.address}, {booking.city}</p>
                </div>
                <div>
                  <p><strong>Services:</strong> {Array.isArray(booking.services) ? booking.services.join(', ') : JSON.parse(booking.services || '[]').join(', ')}</p>
                  <p><strong>Preferred Date:</strong> {formatDate(booking.preferredDate)}</p>
                  <p><strong>Property:</strong> {booking.propertyType} ({booking.bedrooms}BR/{booking.bathrooms}BA)</p>
                </div>
              </div>

              {booking.specialRequests && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Special Requests:</strong> {booking.specialRequests}
                  </p>
                </div>
              )}
            </div>
            
            <div className="text-right ml-6">
              <p className="text-2xl font-bold text-gray-900">${booking.total.toFixed(0)}</p>
              <p className="text-sm text-gray-500">{formatDate(booking.createdAt)}</p>
              {onStatusChange && (
                <select
                  value={booking.status}
                  onChange={(e) => onStatusChange(booking.id, e.target.value as BookingRequest['status'])}
                  className="mt-2 text-xs border border-gray-300 rounded px-2 py-1"
                >
                  {BOOKING_STATUSES.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}