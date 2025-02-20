/* eslint-disable @next/next/no-img-element */
"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Link, Box } from '@mui/material';
import './Login.css'; // Import the CSS file

export default function LoginPage() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/landingpage'); 
  };

  return (
    <div className="login-container">
      <Box className="login-box">
      <img src="/logo/170x100.png" alt="Logo" className="avatar"/>
        <Typography variant="h5" className="login-title">Login</Typography>
        <TextField
          label="Email Address"
          variant="outlined"
          fullWidth
          className="login-textfield"
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          className="login-textfield"
        />
        <Link href="#" className="login-link">Forgot Password?</Link>
        <Button variant="contained" color="primary" fullWidth className="login-button" onClick={handleButtonClick}>Login</Button>
      </Box>
    </div>
  );
}