import { use, useEffect, useState } from 'react';
import  {Club} from '../../../types/index';
import ClubCard from '../../../components/clubs/ClubCard';
import ClubModal from '../../../components/clubs/ClubModel';
import { useClubsStore } from '../../../stores/clubsStore';
import { useParams } from 'react-router-dom';

const ClubsPage: React.FC = () => {
  const clubId = parseInt(useParams().clubId!);
  const { clubs, createClub, updateClub, deleteClub } = useClubsStore();
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (clubId) {
      const club = clubs.find(c => c.id === clubId);
      if (club) {
        setSelectedClub(club);
        // setIsModalOpen(true);
      }
    } 
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Club Details</h1>
        {/* <button
          onClick={() => { setSelectedClub(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Club
        </button> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map(club => (
          <ClubCard
            key={club.id}
            club={club}
            onEdit={() => { setSelectedClub(club); setIsModalOpen(true); }}
            onDelete={() => deleteClub(club.id)}
          />
        ))}
      </div>

      <ClubModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        club={selectedClub}
        onSubmit={selectedClub ? updateClub : createClub}
      />
    </div>
  );
};

export default ClubsPage;