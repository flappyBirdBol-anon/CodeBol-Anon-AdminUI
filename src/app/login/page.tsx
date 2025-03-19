/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Link, Box, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import './Login.css'; // Import the CSS file

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth(); // Get login function
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
  
    try {
      const response = await axios.post('http://143.198.197.240/api/login', {
        email,
        password,
        platform: 'web',
      });
  
      if (response.status === 200) {
        const token = response.data.token || response.data.access_token || response.data;
        login(token); // Pass the token here
        localStorage.setItem('adminToken', token); // Store the token in localStorage
        router.push('/landingpage');
      } else {
        setErrorMessage('Invalid credentials. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Invalid credentials. Please try again.');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-container" onKeyPress={handleKeyPress}>
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
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          className={`login-textfield ${errorMessage ? 'error' : ''}`}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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

export default LoginPage;