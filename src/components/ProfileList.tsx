import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

// Define interface for profile data
interface Profile {
  id: string;
  name: string;
  image: string;
}

interface ProfileListProps {
  profiles: Profile[];
  title: string;
  onProfileClick: (id: string) => void;
}

const ProfileList: React.FC<ProfileListProps> = ({ profiles, title, onProfileClick }) => {
  return (
    <div>
      <Typography variant="h4">{title}</Typography>
      <div className="profile-list">
        {profiles.map((profile) => (
          <Card key={profile.id} className="profile-card" onClick={() => onProfileClick(profile.id)}>
            <CardContent>
              <img src={profile.image} alt={profile.name} className="profile-image" />
              <Typography variant="h5">{profile.name}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfileList;
