import React from 'react';
import ProfileList from '../components/ProfileList';

const TrainerProfileList = ({ trainers }: { trainers: { name: string; image: string }[] }) => {
  return <ProfileList profiles={trainers} title="Trainer Profiles" />;
};

export default TrainerProfileList;
