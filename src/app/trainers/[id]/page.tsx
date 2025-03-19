/* eslint-disable @next/next/no-img-element */
"use client";  

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation'; 
import { Typography, Card, CardContent, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonIcon from '@mui/icons-material/Person';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useRouter } from 'next/navigation'
import './trainerprofile.css'; 
import { useState } from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useAuth } from '../../components/AuthContext';
import axios from 'axios';

const courses = [
  { id: '1', title: 'Course 1', image: '/Image/anime1.jpg' },
  { id: '2', title: 'Course 2', image: '/Image/anime1.jpg' }
];

interface Trainer {
  id: string;
  name: string;
  image: string;
  description: string;
  expertise: string[];
  email: string; 
  organization: string;
  specialization: string[];
  isActive: boolean; // Use isActive instead of isBlacklisted
}

interface AdminProfile {
  email: string;
  first_name: string;
  last_name: string;
}

const TrainerDetail = () => {
  const { logout } = useAuth();
  const { id } = useParams() as { id: string };
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<'blacklist' | 'unblacklist' | null>(null);

  useEffect(() => {
    const fetchTrainer = async () => {
      setIsLoading(true);
      setError(null);
  
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setIsLoading(false);
        return;
      }
  
      try {
        console.log(`Fetching trainer with ID: ${id}`);
        
        const response = await axios.get(`http://143.198.197.240/api/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (response.data && response.data.data) {
          const user = response.data.data;
          
          if (user) {
            console.log('Found user with matching ID:', user);
            const trainer: Trainer = {
              id: user.id || id,
              name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
              image: user.profile_picture || '/Image/anime1.jpg',
              description: user.description || '',
              expertise: user.expertise || [],
              email: user.email || 'No email available',
              organization: user.organization || '',
              specialization: user.specialization || [], 
              isActive: user.is_active // Use is_active to set isActive
            };
            setTrainer(trainer);
          } else {
            setError(`User with ID ${id} not found`);
          }
        } else {
          setError('Invalid data structure received from API');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching trainer:', error.response?.data || error.message);
          setError(`Failed to fetch trainer: ${error.response?.data?.message || error.message}`);
        } else {
          console.error('Unexpected error:', error);
          setError('An unexpected error occurred. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchTrainer();
  }, [id]);

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

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };  

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const navigateToCourse = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  const handleDialogOpen = (action: 'blacklist' | 'unblacklist') => {
    setDialogAction(action);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setTimeout(() => setDialogAction(null), 300); // Delay resetting dialogAction to avoid brief text change
  };

  const handleConfirmAction = async () => {
    if (!dialogAction) return;
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      if (dialogAction === 'blacklist') {
        await axios.put(`http://143.198.197.240/api/blacklist/${id}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert('Trainer has been blacklisted.');
        setTrainer((prevTrainer) => prevTrainer ? { ...prevTrainer, isActive: false } : prevTrainer);
      } else if (dialogAction === 'unblacklist') {
        await axios.put(`http://143.198.197.240/api/unblacklist/${id}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert('Trainer has been unblacklisted.');
        setTrainer((prevTrainer) => prevTrainer ? { ...prevTrainer, isActive: true } : prevTrainer);
      }
    } catch (error) {
      console.error(`Error ${dialogAction}ing trainer:`, error);
      alert(`Failed to ${dialogAction} trainer.`);
    } finally {
      handleDialogClose();
    }
  };

  if (isLoading) {
    return <Typography variant="h5">Loading...</Typography>;
  }
  
  if (error) {
    return <Typography variant="h5">{error}</Typography>;
  }

  if (!trainer) {
    return <Typography variant="h5">Trainer not found</Typography>;
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
            <Typography variant="h4" className="title">Trainer Detail</Typography>
          </div>  

          <Card className="trainer-card">
            <CardContent className="trainer-card-content">
              <div className="trainer-profile">
                <img src={trainer.image} alt={trainer.name} className="trainer-image" />
                <Typography variant="h4" className="trainer-name">{trainer.name}</Typography>
                <Typography variant="body1" className="learner-email">{trainer.email}</Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDialogOpen('blacklist')}
                  disabled={!trainer.isActive} // Disable if not active (blacklisted)
                >
                  Blacklist
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleDialogOpen('unblacklist')}
                  disabled={trainer.isActive} // Disable if active (not blacklisted)
                >
                  Unblacklist
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="content-boxes">
            <div className="trainer-description-box">
              {/* <Typography variant="h5" className="description-title">Description</Typography>
              <Typography variant="body1" className="description-content">{trainer.description}</Typography> */}
              <Typography variant="h5" className="organization-title">Organization</Typography>
              <Typography variant="body1" className="organization-content">{trainer.organization}</Typography>
              <Typography variant="h5" className="specialization-title">Specializations</Typography>
              <Typography variant="body1" className="organization-content">{trainer.specialization}</Typography>
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

          <div className="course-lists">
            <Typography variant="h5" className="courses-title">Courses Uploaded</Typography>
            <div className="courses-container">
              {courses.map((course) => (
                <div key={course.id} className="course" onClick={() => navigateToCourse(course.id)}>
                  <div className="course-header">
                    <img src={course.image} alt={course.title} className="course-image" />
                    <Typography variant="h6" className="course-title">{course.title}</Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
      >
        <DialogTitle>{dialogAction === 'blacklist' ? 'Blacklist Trainer' : 'Unblacklist Trainer'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {dialogAction} this trainer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </ProtectedRoute>
  );
};

export default (TrainerDetail);
