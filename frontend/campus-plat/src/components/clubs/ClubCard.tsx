import React from 'react';

interface Club {
  id: number;
  name: string;
  description: string;
  logo?: string;
  status: 'active' | 'inactive';
  member_count: number;
  faculty_advisor?: string;
  president?: string;
}

interface ClubCardProps {
  club: Club;
  onEdit: () => void;
  onDelete: () => void;
  onViewMembers?: () => void;
  onViewEvents?: () => void;
}

const ClubCard: React.FC<ClubCardProps> = ({ 
  club, 
  onEdit, 
  onDelete, 
  onViewMembers, 
  onViewEvents 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className={`h-2 ${club.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="mr-3 h-12 w-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
              {club.logo ? (
                <img 
                  src={club.logo} 
                  alt={`${club.name} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-blue-600">
                  {club.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{club.name}</h3>
              <span className={`text-sm ${
                club.status === 'active' ? 'text-green-600' : 'text-gray-500'
              }`}>
                {club.status.charAt(0).toUpperCase() + club.status.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              aria-label="Edit club"
              className="text-blue-600 hover:text-blue-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              aria-label="Delete club"
              className="text-red-600 hover:text-red-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{club.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{club.member_count} members</span>
          </div>

          {club.faculty_advisor && (
            <div className="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Advisor: {club.faculty_advisor}</span>
            </div>
          )}

          {club.president && (
            <div className="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>President: {club.president}</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          {onViewMembers && (
            <button
              onClick={onViewMembers}
              className="flex-1 bg-blue-100 text-blue-600 py-2 rounded hover:bg-blue-200 transition-colors"
            >
              Members
            </button>
          )}
          
          {onViewEvents && (
            <button
              onClick={onViewEvents}
              className="flex-1 bg-purple-100 text-purple-600 py-2 rounded hover:bg-purple-200 transition-colors"
            >
              Events
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ClubCard);
