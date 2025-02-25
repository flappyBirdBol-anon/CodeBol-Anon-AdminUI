/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Link, Box } from '@mui/material';
import axios from 'axios';
import './Login.css'; // Import the CSS file
import withAuth from '../components/withAuth';

const LoginPage = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    try {
      const response = await axios.post('http://143.198.197.240/api/login', {
        email,
        password
      });

      if (response.status === 200) {
        const token = response.data.token;
        console.log('Login successful:', token);
        localStorage.setItem('authToken', token); // Store the token in local storage
        router.push('/landingpage');
      } else {
        setErrorMessage('Invalid credentials. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <Box className="login-box">
        <img src="/logo/170x100.png" alt="Logo" className="avatar" />
        <Typography variant="h5" className="login-title">Login</Typography>
        <TextField  
          id="email"
          label="Email Address"
          variant="outlined"
          fullWidth
          className={`login-textfield ${errorMessage ? 'error' : ''}`}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          className={`login-textfield ${errorMessage ? 'error' : ''}`}
        />
        {errorMessage && (
          <Typography variant="body2" color="error" className="error-message">
            {errorMessage}
          </Typography>
        )}
        <Link href="#" className="login-link">Forgot Password?</Link>
        <Button variant="contained" color="primary" fullWidth className="login-button" onClick={handleLogin}>Login</Button>
      </Box>
    </div>
  );
}

export default withAuth(LoginPage);