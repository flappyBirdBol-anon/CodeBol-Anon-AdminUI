/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import ProfileList from '../components/ProfileList';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Define interface for trainer data
interface Trainer {
  id: string;
  name: string;
  image: string;
  email: string; 
}

const TrainersProfileList = () => {
  const router = useRouter();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://143.198.197.240/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data && response.data.data) {
          const trainers = response.data.data
            .filter((user: any) => user.role === 'trainer')
            .map((user: any, index: number) => ({
              id: user.id || `user-${index}`, // Fallback to index if id is missing or duplicate
              name: `${user.first_name || ''} ${user.last_name || ''}`.trim(), // Handle missing name parts
              image: user.profile_picture || '/Image/anime1.jpg',
              email: user.email || 'No email available'
            }));
            console.log('Mapped trainers with IDs:', trainers);
            setTrainers(trainers);
          } else {
            setError('Invalid data structure received from API');
          }
        } catch (error) {
          console.error('Error fetching trainers:', error);
          setError('Failed to fetch trainers. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchTrainers();
    }, []);

  const handleProfileClick = (id: string) => {
    router.push(`/trainers/${id}`);
  };

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <ProfileList profiles={trainers} title="Trainer Profiles" onProfileClick={handleProfileClick} />
      )}
    </div>
  );
};

export default TrainersProfileList;
