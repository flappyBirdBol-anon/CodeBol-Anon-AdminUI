/* eslint-disable @next/next/no-img-element */
"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Typography, Box } from '@mui/material';
import './landingpage.css';
import withAuth from '../components/withAuth';
import { ProtectedRoute } from '../components/ProtectedRoute';

const LandingPage = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <ProtectedRoute>
      <div className="landing-container">
        <Box className="landing-box">
          <img src="/logo/170x100.png" alt="Logo" className="avatar" />
          <Typography variant="h5" className="landing-title">Welcome to the Admin Dashboard</Typography>
          <Typography variant="body1" className="landing-message">You have successfully logged in.</Typography>
          <Typography variant="body1" className="landing-message">Welcome User.</Typography>
          <Button variant="contained" color="primary" fullWidth className="landing-button" onClick={() => navigateTo('/dashboard')}>
            Lets Go!
          </Button>
        </Box>
      </div>
    </ProtectedRoute>
  );
}

export default withAuth(LandingPage);