import React from 'react';
import ProfileList from '../components/ProfileList';
import { useRouter } from 'next/navigation';

const LearnersProfileList = ({ learners }: { learners: { name: string; image: string; id: string }[] }) => {
  const router = useRouter();

  const handleProfileClick = (id: string) => {
    router.push(`/learners/${id}`);
  };

  return <ProfileList profiles={learners} title="Learners Profiles" onProfileClick={handleProfileClick} />;
};

export default LearnersProfileList;
