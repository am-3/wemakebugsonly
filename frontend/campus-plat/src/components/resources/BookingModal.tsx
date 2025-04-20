import React, { useState, useEffect } from 'react';
import { format, addHours, setHours, setMinutes } from 'date-fns';

interface Resource {
  id: number;
  name: string;
  type: string;
  location: string;
  capacity: number;
}

interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

interface BookingData {
  resource_id: number;
  start_time: string;
  end_time: string;
  purpose: string;
  num_attendees: number;
}

interface BookingModalProps {
  resource: Resource;
  onClose: () => void;
  onSubmit: (bookingData: BookingData) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ resource, onClose, onSubmit }) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [purpose, setPurpose] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Generate time slots from 8 AM to 8 PM
  useEffect(() => {
    const date = new Date(selectedDate);
    const slots: TimeSlot[] = [];
    
    // In real app, you'd fetch availability from API
    const startHour = 8; // 8 AM
    const endHour = 20; // 8 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      const start = setHours(setMinutes(new Date(date), 0), hour);
      const end = addHours(start, 1);
      
      // Simulate some slots being unavailable
      const isAvailable = Math.random() > 0.3; // 70% availability
      
      slots.push({
        start,
        end,
        available: isAvailable
      });
    }
    
    setTimeSlots(slots);
    setSelectedSlot(null);
  }, [selectedDate]);
  
  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedSlot(slot);
      setErrors({});
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!selectedSlot) {
      newErrors.slot = 'Please select a time slot';
    }
    
    if (!purpose.trim()) {
      newErrors.purpose = 'Please provide a purpose for your booking';
    }
    
    if (attendees < 1) {
      newErrors.attendees = 'Number of attendees must be at least 1';
    }
    
    if (attendees > resource.capacity) {
      newErrors.attendees = `This resource can only accommodate ${resource.capacity} people`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && selectedSlot) {
      onSubmit({
        resource_id: resource.id,
        start_time: selectedSlot.start.toISOString(),
        end_time: selectedSlot.end.toISOString(),
        purpose,
        num_attendees: attendees
      });
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Book {resource.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Time Slots
                </label>
                {errors.slot && (
                  <p className="mb-2 text-sm text-red-600">{errors.slot}</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSlotSelect(slot)}
                      disabled={!slot.available}
                      className={`py-2 px-3 text-sm rounded-md transition-colors ${
                        selectedSlot === slot
                          ? 'bg-blue-600 text-white'
                          : slot.available
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {format(slot.start, 'h:mm a')}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md ${errors.purpose ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Describe your purpose for booking this resource..."
                />
                {errors.purpose && (
                  <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Attendees
                </label>
                <input
                  type="number"
                  value={attendees}
                  onChange={(e) => setAttendees(parseInt(e.target.value))}
                  min="1"
                  max={resource.capacity}
                  className={`w-full px-3 py-2 border rounded-md ${errors.attendees ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.attendees ? (
                  <p className="mt-1 text-sm text-red-600">{errors.attendees}</p>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">
                    Maximum capacity: {resource.capacity}
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Book Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
