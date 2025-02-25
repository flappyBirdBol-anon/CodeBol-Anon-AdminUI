import React from 'react';
import ProfileList from '../components/ProfileList';
import { useRouter } from 'next/navigation';

const TrainersProfileList = ({ trainers }: { trainers: { name: string; image: string; id: string }[] }) => {
  const router = useRouter();

  const handleProfileClick = (id: string) => {
    router.push(`/trainers/${id}`);
  };

  return <ProfileList profiles={trainers} title="Trainer Profiles" onProfileClick={handleProfileClick} />;
};

export default TrainersProfileList;
