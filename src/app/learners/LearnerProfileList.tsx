/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import ProfileList from '../components/ProfileList';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

// Define interface for learner data
interface Learner {
  id: string;
  name: string;
  image: string;
  email: string; 
  isActive: boolean; // Add this line
}

const LearnersProfileList = () => {
  const router = useRouter();
  const [learners, setLearners] = useState<Learner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLearners = async () => {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://codebolanon.commesr.io/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });


        if (response.data && response.data.data) {
          const learners = await Promise.all(response.data.data
            .filter((user: any) => user.role === 'learner')
            .map(async (user: any, index: number) => {
              let imageUrl = user.profile_picture || '/Image/blank.jpg';
              if (user.profile_picture) {
                try {
                  const imageResponse = await fetch(`https://codebolanon.commesr.io/api/${user.profile_picture}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  if (imageResponse.ok) {
                    const blob = await imageResponse.blob();
                    imageUrl = URL.createObjectURL(blob);
                  }
                } catch (error) {
                  console.error('Error fetching image:', error);
                }
              }
              return {
                id: user.id || `user-${index}`, // Fallback to index if id is missing or duplicate
                name: `${user.first_name || ''} ${user.last_name || ''}`.trim(), // Handle missing name parts
                image: imageUrl,
                email: user.email || 'No email available',
                isActive: user.is_active // Add this line
              };
            }));
          console.log('Mapped learners with IDs:', learners);
          setLearners(learners);
        } else {
          setError('Invalid data structure received from API');
        }
      } catch (error) {
        console.error('Error fetching learners:', error);
        setError('Failed to fetch learners. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearners();
  }, []);

  const handleProfileClick = (id: string) => {
    router.push(`/learners/${id}`);
  };

  return (
    <div style={{ padding: 0, margin: 0 }}>
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
        </div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <ProfileList profiles={learners} title="Learners Profiles" onProfileClick={handleProfileClick} />
      )}
    </div>
  );
};

export default LearnersProfileList;
