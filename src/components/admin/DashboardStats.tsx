import { Calendar, DollarSign, Users, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { BookingRequest, Quote, ServiceProvider } from '@/types';

interface DashboardStatsProps {
  bookings: BookingRequest[];
  quotes: Quote[];
  providers?: ServiceProvider[];
}

export default function DashboardStats({ bookings, quotes, providers = [] }: DashboardStatsProps) {
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.total, 0);
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const verifiedProviders = providers.filter(p => p.isVerified && p.backgroundCheck && p.insurance).length;
  const avgRating = providers.length > 0 
    ? providers.reduce((sum, p) => sum + p.rating, 0) / providers.length
    : 0;

  const stats = [
    {
      label: 'Total Bookings',
      value: bookings.length,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      label: 'Pending',
      value: pendingBookings,
      icon: AlertCircle,
      color: 'text-yellow-600',
    },
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toFixed(0)}`,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      label: 'Quotes',
      value: quotes.length,
      icon: Calendar,
      color: 'text-purple-600',
    },
  ];

  if (providers.length > 0) {
    stats.push(
      {
        label: 'Verified Providers',
        value: verifiedProviders,
        icon: CheckCircle,
        color: 'text-green-600',
      },
      {
        label: 'Avg Rating',
        value: avgRating.toFixed(1),
        icon: Star,
        color: 'text-yellow-600',
      }
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <Icon className={`h-8 w-8 ${stat.color}`} />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}