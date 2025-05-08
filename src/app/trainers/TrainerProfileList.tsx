/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import ProfileList from '../components/ProfileList';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

// Define interface for trainer data
interface Trainer {
  id: string;
  name: string;
  image: string;
  email: string; 
  isActive: boolean;
}

interface ApiUser {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role: string;
  profile_picture?: string;
  is_active: boolean;
}

const TrainersProfileList = () => {
  const router = useRouter();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  // Load profile picture for a single user
  const loadProfilePicture = async (userId: string, profilePicturePath: string) => {
    if (!profilePicturePath) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const response = await fetch(`https://codebolanon.commesr.io/api/${profilePicturePath}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        
        // Update the image URL for this specific user
        setImageUrls(prev => ({
          ...prev,
          [userId]: imageUrl
        }));
      }
    } catch (error) {
      console.error(`Error loading profile picture for user ${userId}:`, error);
    }
  };

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
        const response = await axios.get('https://codebolanon.commesr.io/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data && response.data.data) {
          // First, create trainer objects with default images
          const trainerUsers = response.data.data.filter((user: ApiUser) => user.role === 'trainer');
          
          // Create basic profiles with default images
          const profiles = trainerUsers.map((user: ApiUser, index: number) => ({
            id: user.id || `user-${index}`,
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
            image: '/Image/blank.jpg', // Default image
            email: user.email || 'No email available',
            isActive: user.is_active
          }));
          
          // Set the profiles immediately to show content fast
          setTrainers(profiles);
          setIsLoading(false);
          
          // Begin loading profile pictures in the background
          trainerUsers.forEach((user: ApiUser) => {
            if (user.profile_picture && user.id) {
              loadProfilePicture(user.id, user.profile_picture);
            }
          });
        } else {
          setError('Invalid data structure received from API');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching trainers:', error);
        setError('Failed to fetch trainers. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchTrainers();
    
    // Cleanup function for blob URLs
    return () => {
      Object.values(imageUrls).forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  // Combine basic trainer data with loaded images
  const trainersWithImages = trainers.map(trainer => ({
    ...trainer,
    image: imageUrls[trainer.id] || '/Image/blank.jpg'
  }));

  const handleProfileClick = (id: string) => {
    router.push(`/trainers/${id}`);
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
        <ProfileList profiles={trainersWithImages} title="Trainer Profiles" onProfileClick={handleProfileClick} />
      )}
    </div>
  );
};

export default TrainersProfileList;
