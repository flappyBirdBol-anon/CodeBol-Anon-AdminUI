import React from 'react';
import ProfileList from '../components/ProfileList';

const LearnerProfileList = ({ learners }: { learners: { name: string; image: string }[] }) => {
  return <ProfileList profiles={learners} title="Learner Profiles" />;
};

export default LearnerProfileList;
