import React from 'react';

interface Resource {
  id: number;
  name: string;
  type: string;
  location: string;
  capacity: number;
  description: string;
  amenities?: string[];
  status: 'available' | 'occupied' | 'maintenance';
  image?: string;
}

interface ResourceCardProps {
  resource: Resource;
  onBook: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onBook }) => {
  const isAvailable = resource.status === 'available';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transition-all hover:shadow-lg">
      <div className={`h-2 ${
        resource.status === 'available' ? 'bg-green-500' : 
        resource.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
      }`}></div>
      
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {resource.image ? (
          <img 
            src={resource.image} 
            alt={resource.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
            resource.status === 'available' ? 'bg-green-100 text-green-800' : 
            resource.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
          }`}>
            {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{resource.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">{resource.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>{resource.type}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{resource.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Capacity: {resource.capacity}</span>
          </div>
        </div>
        
        {resource.amenities && resource.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {resource.amenities.map((amenity, index) => (
              <span 
                key={index}
                className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}
        
        <button
          onClick={onBook}
          disabled={!isAvailable}
          className={`w-full py-2 rounded transition-colors ${
            isAvailable 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isAvailable ? 'Book Now' : 'Not Available'}
        </button>
      </div>
    </div>
  );
};

export default React.memo(ResourceCard);
