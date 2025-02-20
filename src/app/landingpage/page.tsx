/* eslint-disable @next/next/no-img-element */
"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Typography, Box } from '@mui/material';
import './landingpage.css';

export default function LandingPage() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/dashboard'); 
  };

  return (
    <div className="landing-container">
      <Box className="landing-box">
        <img src="/logo/170x100.png" alt="Logo" className="avatar" />
        <Typography variant="h5" className="landing-title">Welcome to the Admin Dashboard</Typography>
        <Typography variant="body1" className="landing-message">You have successfully logged in.</Typography>
        <Typography variant="body1" className="landing-message">Welcome User.</Typography>
        <Button variant="contained" color="primary" fullWidth className="landing-button" onClick={handleButtonClick}>
          Lets Go!
        </Button>
      </Box>
    </div>
  );
}