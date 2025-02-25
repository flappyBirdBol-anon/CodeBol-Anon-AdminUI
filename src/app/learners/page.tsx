/* eslint-disable @next/next/no-img-element */
"use client"   
import { BarChart, Download } from "lucide-react"
import { Button, Typography } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useRouter } from 'next/navigation'
import LearnerProfileList from './LearnerProfileList'
import { useState } from 'react';
import withAuth from '../components/withAuth';

ChartJS.register(ArcElement, Tooltip, Legend)
import './learners.css' // Import the CSS file

const LearnersPage = () => {

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

  const learners = [
    { id: '1', name: 'Adrianne', image: './Image/kat.jpg' },
    { id: '2', name: 'Charlie', image: './Image/burritocat.webp' },
    { id: '3', name: 'Jhobert', image: './Image/Anime.jpg' },
    { id: '4', name: 'Jessa', image: './Image/kat.jpg' },
    { id: '5', name: 'Brianne', image: './Image/burritocat.webp' },
    { id: '6', name: 'Tim', image: './Image/kat.jpg' },
  ];

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
          <Typography variant="h4" className="title">Learners Page</Typography>
          <Button variant="outlined" className="button" startIcon={<Download />}>
            Download
          </Button>
        </div>  

        {/* Filters
        <div className="filters">
          <Select defaultValue="all-time">
            <MenuItem value="all-time">All-time</MenuItem>
            <MenuItem value="this-month">This Month</MenuItem>
            <MenuItem value="last-month">Last Month</MenuItem>
          </Select>

          <Select defaultValue="all">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="trainers">Trainers</MenuItem>
            <MenuItem value="learners">Learners</MenuItem>
          </Select>

          <Select defaultValue="all">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="development">Development</MenuItem>
            <MenuItem value="design">Design</MenuItem>
          </Select>
        </div> */}

        {/* Learner Profiles */}
        <div className="learner-profiles">
        <LearnerProfileList learners={learners} />
        </div>
      </div>
    </div>
  )
}

export default withAuth(LearnersPage);