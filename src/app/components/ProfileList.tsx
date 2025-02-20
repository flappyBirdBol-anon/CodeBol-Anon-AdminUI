/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Typography, TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material';

const ProfileList = ({ profiles, title }: { profiles: { name: string; image: string }[], title: string }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('A-Z');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortOrder(event.target.value as string);
  };

  const sortedProfiles = [...profiles].sort((a, b) => {
    if (sortOrder === 'A-Z') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const filteredProfiles = sortedProfiles.filter((profile) =>
    profile.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <Card className="profile-list">
      <CardHeader title={<span className="title">{title}</span>} />
      <CardContent>
        <div className="search-filter-container">
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <Select className="filters" value={sortOrder} onChange={handleSortChange}>
            <MenuItem value="A-Z">A - Z</MenuItem>
            <MenuItem value="Z-A">Z - A</MenuItem>
          </Select>
        </div>
        <div className="profiles-grid">
          {filteredProfiles.map((profile) => (
            <div key={profile.name} className="profile">
              <img src={profile.image} alt={profile.name} className="profile-image" />
              <div className="profile-info">
                <Typography variant="subtitle1" className="profile-name">{profile.name}</Typography>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileList;
