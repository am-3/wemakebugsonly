import { useState, useMemo } from 'react';
import { Resource } from '../../../types/index';
import ResourceCard from '../../../components/resources/ResourceCard';
import BookingModal from '../../../components/resources/BookingModal';
import { useResourcesStore } from '../../../stores/resourcesStore';

const ResourcesPage: React.FC = () => {
  const { resources, createBooking } = useResourcesStore();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = useMemo(() => 
    resources.filter(r => 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      r.status === 'available'
    )
  , [resources, searchTerm]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Available Resources</h1>
        <input
          type="text"
          placeholder="Search resources..."
          className="w-full md:w-64 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onBook={() => setSelectedResource(resource)}
          />
        ))}
      </div>

      {selectedResource && (
        <BookingModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onSubmit={createBooking}
        />
      )}
    </div>
  );
};
export default ResourcesPage;