/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import ProfileList from '../components/ProfileList';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Define interface for learner data
interface Learner {
  id: string;
  name: string;
  image: string;
  email: string; 
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
        const response = await axios.get('http://143.198.197.240/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data && response.data.data) {
          const learners = response.data.data
          .filter((user: any) => user.role === 'learner')
          .map((user: any, index: number) => ({
            id: user.id || `user-${index}`, // Use ID as the identifier
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
            image: user.profile_picture || '/Image/anime1.jpg',
            email: user.email || 'No email available'
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
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <ProfileList profiles={learners} title="Learners Profiles" onProfileClick={handleProfileClick} />
      )}
    </div>
  );
};

export default LearnersProfileList;
