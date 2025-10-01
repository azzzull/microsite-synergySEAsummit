import React, { useState, useEffect } from 'react';
import { AlertCircle, Users, Ticket, CheckCircle } from 'lucide-react';

interface TicketAvailabilityProps {
  className?: string;
  showDetails?: boolean;
  refreshTrigger?: number;
}

interface TicketAvailabilityData {
  totalSold: number;
  maxTickets: number;
  remainingTickets: number;
  isAvailable: boolean;
  percentageSold: number;
}

export const TicketAvailability: React.FC<TicketAvailabilityProps> = ({ 
  className = '',
  showDetails = true,
  refreshTrigger = 0
}) => {
  const [availability, setAvailability] = useState<TicketAvailabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/ticket-availability');
      const data = await response.json();
      
      if (data.success) {
        setAvailability(data);
      } else {
        setError(data.error || 'Failed to check ticket availability');
      }
    } catch (err: any) {
      setError('Failed to connect to server');
      console.error('Ticket availability fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className={`bg-gray-100 border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Checking ticket availability...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  if (!availability) {
    return null;
  }

  const getStatusColor = () => {
    if (availability.percentageSold >= 90) return 'red';
    if (availability.percentageSold >= 75) return 'orange';
    return 'green';
  };

  const statusColor = getStatusColor();
  const colorClasses = {
    red: 'bg-red-50 border-red-200 text-red-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    green: 'bg-green-50 border-green-200 text-green-700'
  };

  const iconColorClasses = {
    red: 'text-red-500',
    orange: 'text-orange-500',
    green: 'text-green-500'
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[statusColor]} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {availability.isAvailable ? (
            <CheckCircle className={`w-5 h-5 ${iconColorClasses[statusColor]}`} />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="font-medium">
            {availability.isAvailable ? 'Tickets Available' : 'Event Full'}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Users className={`w-4 h-4 ${iconColorClasses[statusColor]}`} />
            <span className="text-sm font-medium">
              {availability.totalSold}/{availability.maxTickets} sold
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Ticket className={`w-4 h-4 ${iconColorClasses[statusColor]}`} />
            <span className="text-sm font-medium">
              {availability.remainingTickets} left
            </span>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{availability.percentageSold}% sold</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                statusColor === 'red' ? 'bg-red-500' :
                statusColor === 'orange' ? 'bg-orange-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(availability.percentageSold, 100)}%` }}
            ></div>
          </div>
          
          {!availability.isAvailable && (
            <div className="mt-2 text-sm font-medium text-red-700">
              ⚠️ No more tickets available for this event
            </div>
          )}
          
          {availability.isAvailable && availability.percentageSold >= 90 && (
            <div className="mt-2 text-sm font-medium">
              ⚡ Only {availability.remainingTickets} tickets remaining!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketAvailability;