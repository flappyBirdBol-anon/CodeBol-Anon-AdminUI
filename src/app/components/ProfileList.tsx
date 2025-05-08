/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Typography, TextField, Select, MenuItem, SelectChangeEvent, FormControl } from '@mui/material';
import './ProfileList.css';

interface Profile {
  id: string;
  name: string;
  image: string;
  email: string;
  isActive: boolean;
}

interface ProfileListProps {
  profiles: Profile[];
  title: string;
  onProfileClick: (id: string) => void;
}

const ProfileList: React.FC<ProfileListProps> = ({ profiles, title, onProfileClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('A-Z');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortOrder(event.target.value as string);
  };

  const sortedProfiles = [...profiles].sort((a, b) => {
    if (!a.name || !b.name) return 0; // Add check to ensure names are defined
    
    if (sortOrder === 'A-Z') {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === 'Z-A') {
      return b.name.localeCompare(a.name);
    } else if (sortOrder === 'blacklisted') {
      // Sort by blacklisted status (inactive means blacklisted)
      return a.isActive === b.isActive ? 0 : a.isActive ? 1 : -1;
    } else if (sortOrder === 'not-blacklisted') {
      // Sort by not blacklisted (active) status
      return a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1;
    }
    return 0;
  });

  const filteredProfiles = sortedProfiles.filter((profile) => {
    // Filter based on search term
    const matchesSearch = profile.name && profile.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply additional filters
    if (sortOrder === 'blacklisted') {
      return matchesSearch && !profile.isActive;
    } else if (sortOrder === 'not-blacklisted') {
      return matchesSearch && profile.isActive;
    }
    
    return matchesSearch;
  });

  // Create display name for sort option
  const getSortDisplayValue = () => {
    switch(sortOrder) {
      case 'A-Z': return 'Name: A to Z';
      case 'Z-A': return 'Name: Z to A';
      case 'blacklisted': return 'Blacklisted Profiles';
      case 'not-blacklisted': return 'Active Profiles';
      default: return 'Name: A to Z';
    }
  };

  return (
    <Card className="profile-list">
      <CardHeader title={<span className="title">{title}</span>} />
      <CardContent>
        <div className="search-filter-container">
          <TextField
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
            placeholder="Search"
            InputProps={{ classes: { root: 'course-style-input' } }}
          />
          <FormControl className="filter-select-container">
            <Select
              value={sortOrder}
              onChange={handleSortChange}
              className="filter-select course-style-select"
              renderValue={() => getSortDisplayValue()}
            >
              <MenuItem value="A-Z">Name: A to Z</MenuItem>
              <MenuItem value="Z-A">Name: Z to A</MenuItem>
              <MenuItem value="blacklisted">Blacklisted Profiles</MenuItem>
              <MenuItem value="not-blacklisted">Active Profiles</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="profiles-grid">
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                className={`profile ${profile.isActive ? 'active' : 'inactive'}`}
                onClick={() => onProfileClick(profile.id)}
              >
                <img src={profile.image} alt={profile.name} className="profile-image" />
                <div className="profile-info">
                  <Typography variant="subtitle1" className="profile-name">{profile.name}</Typography>
                  <Typography variant="body2" className="profile-email">{profile.email}</Typography>
                </div>
              </div>
            ))
          ) : (
            <Typography variant="body1" style={{ margin: '20px auto', textAlign: 'center' }}>
              No profiles match your search criteria
            </Typography>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileList;
