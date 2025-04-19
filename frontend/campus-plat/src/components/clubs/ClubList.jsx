// src/components/clubs/ClubList.tsx
import { useEffect } from 'react';
import { useClubsStore } from '../../stores/clubsStore';
import { Link } from 'react-router-dom';
import './ClubList.css';

const ClubList = () => {
  const { clubs, loading, error, fetchClubs } = useClubsStore();
  
  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  if (loading) return <div className="loading">Loading clubs...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="club-list-container">
      <h2>Student Clubs</h2>
      <div className="add-club">
        <Link to="/clubs/new" className="add-button">Create New Club</Link>
      </div>
      
      {clubs.length === 0 ? (
        <div className="no-clubs">No clubs available</div>
      ) : (
        <div className="club-grid">
          {clubs.map(club => (
            <div key={club.id} className="club-card">
              <div className="club-logo">
                {club.logo ? (
                  <img src={club.logo} alt={club.name} />
                ) : (
                  <div className="logo-placeholder">{club.name.charAt(0)}</div>
                )}
              </div>
              <h3>{club.name}</h3>
              <p>{club.description.substring(0, 100)}...</p>
              <div className="club-meta">
                <span className="member-count">{club.member_count} members</span>
                <span className={`status ${club.status}`}>{club.status}</span>
              </div>
              <Link to={`/clubs/${club.id}`} className="view-button">View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubList;
