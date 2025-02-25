/* eslint-disable @next/next/no-img-element */
"use client";  

import React from 'react';
import { useParams } from 'next/navigation'; 
import { Typography, Card, CardContent, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import { useRouter } from 'next/navigation'
import './learnerprofile.css'; // Import the CSS file
import { useState } from 'react';
import withAuth from '../../components/withAuth';
import { BarChart } from 'lucide-react';

const learners = [
  { id: '1', name: 'Adrianne', image: '/Image/kat.jpg', description: 'Learners description for Adrianne', interests: ['React', 'Node.js'] },
  { id: '2', name: 'Charlie', image: '/Image/burritocat.webp', description: 'Learners description for Charlie', interests: ['Python', 'Django'] },
  { id: '3', name: 'Jhobert', image: '/Image/Anime.jpg', description: 'Learners description for Jhobert', interests: ['Java', 'Spring'] },
  { id: '4', name: 'Jessa', image: '/Image/kat.jpg', description: 'Learners description for Jessa', interests: ['C#', '.NET'] },
  { id: '5', name: 'Brianne', image: '/Image/burritocat.webp', description: 'Learners description for Brianne', interests: ['Ruby', 'Rails'] },
  { id: '6', name: 'Tim', image: '/Image/kat.jpg', description: 'Learners description for Tim', interests: ['Go', 'Kubernetes'] },
];

const LearnerDetail = () => {
  const { id } = useParams() as { id: string };
  const learner = learners.find((learner) => learner.id === id);
  
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

  if (!learner) {
    return <Typography variant="h5">Learner not found</Typography>;
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

          <Button variant="text" className="button" startIcon={<PersonOutlinedIcon />} onClick={() => navigateTo('/trainers')}>
            Trainers
          </Button>

          <Button variant="contained" className="button active" startIcon={<GroupOutlinedIcon />} onClick={() => navigateTo('/learners')}>
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
          <Typography variant="h4" className="title">Learner Detail</Typography>
        </div>  

        <Card className="learner-card">
          <CardContent className="learner-card-content">
            <div className="learner-profile">
              <img src={learner.image} alt={learner.name} className="learner-image" />
              <Typography variant="h4" className="learner-name">{learner.name}</Typography>
            </div>
          </CardContent>
        </Card>

        <div className="content-boxes">
          <div className="learner-description-box">
            <Typography variant="h5" className="description-title">Description</Typography>
            <Typography variant="body1" className="description-content">{learner.description}</Typography>
          </div>
          <div className="learner-interests-box">
            <Typography variant="h5" className="interests-title">Interests</Typography>
            <ul className="interests-list">
              {learner.interests.map((interest, index) => (
                <li key={index} className="interests-item">{interest}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(LearnerDetail);
