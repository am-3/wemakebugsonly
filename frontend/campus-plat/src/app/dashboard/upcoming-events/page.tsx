import { useState, useMemo } from 'react';
import { Event } from '../../../types/index';
import EventCard from '../../../components/events/EventCard';
import EventModal from '../../../components/events/EventModal';
import { useEventStore } from '../../../stores/eventStore';

const EventsPage: React.FC = () => {
  const { events, createEvent, updateEvent, deleteEvent } = useEventStore();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const upcomingEvents = useMemo(() => 
    events.filter(e => new Date(e.end_time) > new Date())
  , [events]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Upcoming Events</h1>
        <button
          onClick={() => { setSelectedEvent(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingEvents.map(event => (
          <EventCard 
            key={event.id}
            event={event}
            onEdit={() => { setSelectedEvent(event); setIsModalOpen(true); }}
            onDelete={() => deleteEvent(event.id)}
          />
        ))}
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
        onSubmit={selectedEvent ? updateEvent : createEvent}
      />
    </div>
  );
};

export default EventsPage;