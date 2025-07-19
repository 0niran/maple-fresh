'use client';

import { useState, useCallback } from 'react';
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { BookingRequest, ServiceProvider } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Calendar as CalendarIcon, Clock, User } from 'lucide-react';

const localizer = momentLocalizer(moment);

interface SchedulingCalendarProps {
  bookings: BookingRequest[];
  providers: ServiceProvider[];
  onBookingSelect?: (booking: BookingRequest) => void;
  onSlotSelect?: (slotInfo: { start: Date; end: Date }) => void;
  onBookingUpdate?: (bookingId: string, updates: Partial<BookingRequest>) => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: BookingRequest;
  status: string;
}

export default function SchedulingCalendar({
  bookings,
  providers,
  onBookingSelect,
  onSlotSelect,
  onBookingUpdate,
}: SchedulingCalendarProps) {
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState(new Date());

  // Convert bookings to calendar events
  const events: CalendarEvent[] = bookings
    .filter(booking => booking.scheduledAt)
    .map(booking => {
      const startDate = new Date(booking.scheduledAt!);
      const endDate = new Date(startDate.getTime() + (booking.estimatedDuration || 120) * 60000);
      
      return {
        id: booking.id,
        title: `${booking.customer.firstName} ${booking.customer.lastName} - ${
          Array.isArray(booking.services) 
            ? booking.services.join(', ') 
            : JSON.parse(booking.services || '[]').join(', ')
        }`,
        start: startDate,
        end: endDate,
        resource: booking,
        status: booking.status,
      };
    });

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    onBookingSelect?.(event.resource);
  }, [onBookingSelect]);

  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date }) => {
    onSlotSelect?.(slotInfo);
  }, [onSlotSelect]);

  const handleEventDrop = useCallback(
    ({ event, start, end }: { event: CalendarEvent; start: Date; end: Date }) => {
      // const updatedBooking = {
      //   ...event.resource,
      //   scheduledAt: start.toISOString(),
      //   estimatedDuration: Math.round((end.getTime() - start.getTime()) / 60000),
      // };

      onBookingUpdate?.(event.id, {
        scheduledAt: start.toISOString(),
        estimatedDuration: Math.round((end.getTime() - start.getTime()) / 60000),
      });
    },
    [onBookingUpdate]
  );

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3174ad';
    
    switch (event.status) {
      case 'pending':
        backgroundColor = '#f59e0b';
        break;
      case 'confirmed':
        backgroundColor = '#3b82f6';
        break;
      case 'in_progress':
        backgroundColor = '#8b5cf6';
        break;
      case 'completed':
        backgroundColor = '#10b981';
        break;
      case 'cancelled':
        backgroundColor = '#ef4444';
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const CustomToolbar = ({ label, onNavigate, onView }: { label: string; onNavigate: (action: string) => void; onView: (view: View) => void }) => (
    <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-900">{label}</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('PREV')}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('TODAY')}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('NEXT')}
          >
            Next
          </Button>
        </div>
      </div>
      
      <div className="flex space-x-2">
        {[Views.MONTH, Views.WEEK, Views.DAY].map((viewName) => (
          <Button
            key={viewName}
            variant={view === viewName ? "default" : "outline"}
            size="sm"
            onClick={() => onView(viewName)}
          >
            {viewName.charAt(0).toUpperCase() + viewName.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );

  const CustomEvent = ({ event }: { event: CalendarEvent }) => (
    <div className="p-1">
      <div className="font-semibold text-xs truncate">
        {event.resource.customer.firstName} {event.resource.customer.lastName}
      </div>
      <div className="text-xs opacity-90 truncate">
        {Array.isArray(event.resource.services) 
          ? event.resource.services.join(', ') 
          : JSON.parse(event.resource.services || '[]').join(', ')}
      </div>
      <div className="text-xs opacity-75">
        ${event.resource.total.toFixed(0)}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CalendarIcon className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Scheduling Calendar</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Status Legend */}
          <div className="flex items-center space-x-3 text-sm">
            {[
              { status: 'pending', color: 'bg-yellow-500', label: 'Pending' },
              { status: 'confirmed', color: 'bg-blue-500', label: 'Confirmed' },
              { status: 'in_progress', color: 'bg-purple-500', label: 'In Progress' },
              { status: 'completed', color: 'bg-green-500', label: 'Completed' },
            ].map(({ status, color, label }) => (
              <div key={status} className="flex items-center">
                <div className={`w-3 h-3 rounded ${color} mr-1`}></div>
                <span className="text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <CalendarIcon className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Scheduled</p>
              <p className="text-xl font-bold text-blue-900">{events.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm text-green-600 font-medium">Today&apos;s Jobs</p>
              <p className="text-xl font-bold text-green-900">
                {events.filter(e => moment(e.start).isSame(moment(), 'day')).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <User className="w-5 h-5 text-purple-600 mr-2" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Active Providers</p>
              <p className="text-xl font-bold text-purple-900">
                {providers.filter(p => p.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center">
            <Plus className="w-5 h-5 text-orange-600 mr-2" />
            <div>
              <p className="text-sm text-orange-600 font-medium">Unscheduled</p>
              <p className="text-xl font-bold text-orange-900">
                {bookings.filter(b => !b.scheduledAt && b.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div style={{ height: '600px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onEventDrop={handleEventDrop}
          selectable
          resizable
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: CustomToolbar,
            event: CustomEvent,
          }}
          step={30}
          timeslots={2}
          min={new Date(2023, 0, 1, 7, 0)} // 7 AM
          max={new Date(2023, 0, 1, 19, 0)} // 7 PM
          defaultView={Views.WEEK}
        />
      </div>

      {/* Calendar Styles */}
      <style jsx global>{`
        .rbc-calendar {
          font-family: inherit;
        }
        .rbc-header {
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 8px;
          font-weight: 600;
          color: #374151;
        }
        .rbc-time-view .rbc-time-gutter,
        .rbc-time-view .rbc-time-content {
          border-color: #e2e8f0;
        }
        .rbc-time-slot {
          border-color: #f1f5f9;
        }
        .rbc-today {
          background-color: #fef3c7;
        }
        .rbc-off-range-bg {
          background-color: #f9fafb;
        }
        .rbc-event-label {
          display: none;
        }
      `}</style>
    </div>
  );
}