/* eslint-disable @next/next/no-img-element */
"use client"
import { Download } from "lucide-react"
import { Button, Typography } from '@mui/material'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonIcon from '@mui/icons-material/Person';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useRouter } from 'next/navigation'
import TrainerProfileList from './TrainerProfileList' 
import { useEffect, useState } from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../components/AuthContext';

ChartJS.register(ArcElement, Tooltip, Legend)
import './trainers.css'
import axios from "axios";

interface AdminProfile {
  email: string;
  first_name: string;
  last_name: string;
}

const TrainersPage = () => {
  // const trainers = [
  //   { id: '1', name: 'Adrianne', image: './Image/kat.jpg' },
  //   { id: '2', name: 'Charlie', image: './Image/burritocat.webp' },
  //   { id: '3', name: 'Jhobert', image: './Image/Anime.jpg' },
  //   { id: '4', name: 'Jessa', image: './Image/kat.jpg' },
  //   { id: '5', name: 'Brianne', image: './Image/burritocat.webp' },
  //   { id: '6', name: 'Tim', image: './Image/kat.jpg' },
  // ];

  const { logout } = useAuth();
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };  

  const navigateTo = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    const fetchAdminProfile = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      try {
        const response = await axios.get('http://143.198.197.240/api/profile/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.data) {
          setAdminProfile(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching admin profile:', error);
      }
    };

    fetchAdminProfile();
  }, []);

  return (
    <ProtectedRoute>
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
            <Button variant="text" className="button" startIcon={<DashboardOutlinedIcon />} onClick={() => navigateTo('/dashboard')}>
              Dashboard
            </Button>

            <Button variant="contained" className="button active" startIcon={<PersonIcon />} onClick={() => navigateTo('/trainers')}>
              Trainers
            </Button>

            <Button variant="text" className="button" startIcon={<GroupOutlinedIcon />} onClick={() => navigateTo('/learners')}>
              Learners
            </Button>

            <Button variant="text" className="button" startIcon={<ExitToAppIcon />} onClick={logout}>
              Logout
            </Button>
          </nav>
          
          {/* <div className="sidebar-support">
            <Typography variant="subtitle1" className="support-title">Support</Typography>
            {["Get Started", "Settings"].map((item) => (
              <Button key={item} variant="text" className="button" startIcon={<BarChart />}>
                {item}
              </Button>
            ))}
          </div> */}
          <div className="sidebar-footer">
            <img src="/logo/170x100.png" alt="Logo" className="adminavatar" />
            {adminProfile ? (
              <>
                <Typography variant="body2" className="admin-name">
                  {adminProfile.first_name} {adminProfile.last_name}
                </Typography>
                <Typography variant="body2" className="admin-email">
                  {adminProfile.email}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" className="footer-text">Loading...</Typography>
            )}
            <Typography variant="body2" className="footer-text2">© 2025 Company Name</Typography>
            <Typography variant="body2" className="footer-text2">Created by the FlappyBords CodeBol-anon team</Typography>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="header">
            <Typography variant="h4" className="title">Trainer Page</Typography>
            <Button variant="outlined" className="button" startIcon={<Download />}>
              Download
            </Button>
          </div>  

          {/* Trainer Profiles */}
          <div className="trainer-profiles">
          <TrainerProfileList />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default (TrainersPage);