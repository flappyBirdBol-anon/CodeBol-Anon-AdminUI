/* eslint-disable @next/next/no-img-element */
"use client";  

import React from 'react';
import { BarChart } from 'lucide-react';
import { useParams } from 'next/navigation'; 
import { Typography, Card, CardContent, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useRouter } from 'next/navigation'
import './trainerprofile.css'; // Import the CSS file
import { useState } from 'react';
import withAuth from '../../components/withAuth';

const trainers = [
  { id: '1', name: 'Adrianne', image: '/Image/kat.jpg', description: 'Trainer description for Adrianne', expertise: ['React', 'Node.js'] },
  { id: '2', name: 'Charlie', image: '/Image/burritocat.webp', description: 'Trainer description for Charlie', expertise: ['Python', 'Django'] },
  { id: '3', name: 'Jhobert', image: '/Image/Anime.jpg', description: 'Trainer description for Jhobert', expertise: ['Java', 'Spring'] },
  { id: '4', name: 'Jessa', image: '/Image/kat.jpg', description: 'Trainer description for Jessa', expertise: ['C#', '.NET'] },
  { id: '5', name: 'Brianne', image: '/Image/burritocat.webp', description: 'Trainer description for Brianne', expertise: ['Ruby', 'Rails'] },
  { id: '6', name: 'Tim', image: '/Image/kat.jpg', description: 'Trainer description for Tim', expertise: ['Go', 'Kubernetes'] },
];

const TrainerDetail = () => {
  const { id } = useParams() as { id: string };
  const trainer = trainers.find((trainer) => trainer.id === id);

  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };  

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  if (!trainer) {
    return <Typography variant="h5">Trainer not found</Typography>;
  }

  return (
    <div className="dashboard-container">
      {/* Burger Menu */}
      <div className="burger-menu" onClick={toggleSidebar}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
        <div className="sidebar-header">  
          <img src="/logo/170x100.png" alt="Logo" className="avatar" />
          <Typography variant="h5" className="title">Dashboard</Typography>
        </div>

        <nav className="sidebar-nav">
          <Button variant="text" className="button" startIcon={<DashboardIcon />} onClick={() => navigateTo('/dashboard')}>
            Dashboard
          </Button>

          <Button variant="contained" className="button active" startIcon={<PersonOutlinedIcon />} onClick={() => navigateTo('/trainers')}>
            Trainers
          </Button>

          <Button variant="text" className="button" startIcon={<GroupOutlinedIcon />} onClick={() => navigateTo('/learners')}>
            Learners
          </Button>

          <Button variant="text" className="button" startIcon={<ExitToAppIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </nav>
        
        <div className="sidebar-support">
          <Typography variant="subtitle1" className="support-title">Support</Typography>
          {["Get Started", "Settings"].map((item) => (
            <Button key={item} variant="text" className="button" startIcon={<BarChart />}>
              {item}
            </Button>
          ))}
        </div>
        <div className="sidebar-footer">
          <img src="/logo/170x100.png" alt="Logo" className="adminavatar" />
          <Typography variant="body2" className="footer-text">Admin</Typography>
          <Typography variant="body2" className="footer-text2">© 2025 Company Name</Typography>
          <Typography variant="body2" className="footer-text2">Created by the FlappyBords CodeBol-anon team</Typography>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <Typography variant="h4" className="title">Trainer Detail</Typography>
        </div>  

        <Card className="trainer-card">
          <CardContent className="trainer-card-content">
            <div className="trainer-profile">
              <img src={trainer.image} alt={trainer.name} className="trainer-image" />
              <Typography variant="h4" className="trainer-name">{trainer.name}</Typography>
            </div>
          </CardContent>
        </Card>

        <div className="content-boxes">
          <div className="trainer-description-box">
            <Typography variant="h5" className="description-title">Description</Typography>
            <Typography variant="body1" className="description-content">{trainer.description}</Typography>
          </div>
          <div className="trainer-expertise-box">
            <Typography variant="h5" className="expertise-title">Expertise</Typography>
            <ul className="expertise-list">
              {trainer.expertise.map((skill, index) => (
                <li key={index} className="expertise-item">{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(TrainerDetail);
