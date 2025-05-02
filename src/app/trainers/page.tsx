"use client"
import { Button, Typography, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
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
  const [isLoading, setIsLoading] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };  

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    logout();
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  useEffect(() => {
    const fetchAdminProfile = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      try {
        const response = await axios.get('https://codebolanon.commesr.io/api/profile/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.data) {
          setAdminProfile(response.data.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error fetching admin profile:', error.response?.data || error.message);
        } else {
          console.error('Unexpected error fetching admin profile:', error);
        }
      }
      setIsLoading(false);
    };

    fetchAdminProfile();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

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
            {adminProfile ? (
              <div className="admin-info">
                <Typography variant="body2" className="admin-name">
                  {adminProfile.first_name} {adminProfile.last_name}
                </Typography>
                <Typography variant="body2" className="admin-email">
                  {adminProfile.email}
                </Typography>
              </div>
            ) : (
              <Typography variant="body2">Loading...</Typography>
            )}
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

            <Button variant="text" className="button" startIcon={<ExitToAppIcon />} onClick={handleLogoutClick}>
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
            <Typography variant="body2" className="footer-text2">© 2025 Company Name</Typography>
            <Typography variant="body2" className="footer-text2">Created by the FlappyBords CodeBol-anon team</Typography>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="header">
            <Typography variant="h4" className="title">Trainer Page</Typography>
          </div>  

          {/* Trainer Profiles */}
          <div className="trainer-profiles">
          <TrainerProfileList />
          </div>
        </div>
        
        {/* Logout Confirmation Dialog */}
        <Dialog
          open={logoutDialogOpen}
          onClose={handleLogoutCancel}
        >
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to logout?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLogoutCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleLogoutConfirm} color="primary">
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}

export default (TrainersPage);