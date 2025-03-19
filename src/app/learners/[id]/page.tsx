/* eslint-disable @next/next/no-img-element */
"use client";  

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 
import { Typography, Card, CardContent, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupIcon from '@mui/icons-material/Group';
import { useRouter } from 'next/navigation'
import './learnerprofile.css';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useAuth } from '../../components/AuthContext';
import axios from 'axios';


const courses = [
  { id: '1', title: 'Course 1', image: '/Image/anime1.jpg' },
  { id: '2', title: 'Course 2', image: '/Image/anime1.jpg' }
];

interface Learner {
  id: string;
  name: string;
  image: string;
  description: string;
  interests: string[];
  email: string; 
  isActive: boolean; // Use isActive instead of isBlacklisted
}

interface AdminProfile {
  email: string;
  first_name: string;
  last_name: string;
}

const LearnerDetail = () => {
  const { logout } = useAuth();
  const { id } = useParams() as { id: string };
  const [learner, setLearner] = useState<Learner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<'blacklist' | 'unblacklist' | null>(null);

  useEffect(() => {
    const fetchLearner = async () => {
      setIsLoading(true);
      setError(null);
  
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setIsLoading(false);
        return;
      }
  
      try {
        console.log(`Fetching learner with ID: ${id}`);
        
        const response = await axios.get(`http://143.198.197.240/api/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (response.data && response.data.data) {
          const user = response.data.data;
          
          if (user) {
            console.log('Found user with matching ID:', user);
            const learner: Learner = {
              id: user.id || id,
              name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
              image: user.profile_picture || '/Image/anime1.jpg',
              description: user.description || 'No description available.',
              interests: user.interests || [],
              email: user.email || 'No email available',
              isActive: user.is_active // Use is_active to set isActive
            };
            setLearner(learner);
          } else {
            setError(`User with identifier ${id} not found`);
          }
        } else {
          setError('Invalid data structure received from API');
        }
      } catch (error) {
        console.error('Error fetching learner:', error);
        setError('Failed to fetch learner. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchLearner();
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
        alert('Learner has been blacklisted.');
        setLearner((prevLearner) => prevLearner ? { ...prevLearner, isActive: false } : prevLearner);
      } else if (dialogAction === 'unblacklist') {
        await axios.put(`http://143.198.197.240/api/unblacklist/${id}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert('Learner has been unblacklisted.');
        setLearner((prevLearner) => prevLearner ? { ...prevLearner, isActive: true } : prevLearner);
      }
    } catch (error) {
      console.error(`Error ${dialogAction}ing learner:`, error);
      alert(`Failed to ${dialogAction} learner.`);
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

  if (!learner) {
    return <Typography variant="h5">Learner not found</Typography>;
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

            <Button variant="text" className="button" startIcon={<PersonOutlinedIcon />} onClick={() => navigateTo('/trainers')}>
              Trainers
            </Button>

            <Button variant="contained" className="button active" startIcon={<GroupIcon />} onClick={() => navigateTo('/learners')}>
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
            <Typography variant="h4" className="title">Learner Detail</Typography>
          </div>  

          <Card className="learner-card">
            <CardContent className="learner-card-content">
              <div className="learner-profile">
                <img src={learner.image} alt={learner.name} className="learner-image" />
                <Typography variant="h4" className="learner-name">{learner.name}</Typography>
                <Typography variant="body1" className="learner-email">{learner.email}</Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDialogOpen('blacklist')}
                  disabled={!learner.isActive} // Disable if not active (blacklisted)
                >
                  Blacklist
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleDialogOpen('unblacklist')}
                  disabled={learner.isActive} // Disable if active (not blacklisted)
                >
                  Unblacklist
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="content-boxes">
            {/* <div className="learner-description-box">
              <Typography variant="h5" className="description-title">Description</Typography>
              <Typography variant="body1" className="description-content">{learner.description}</Typography>
            </div> */}
            <div className="learner-interests-box">
              <Typography variant="h5" className="interests-title">Interests</Typography>
              <ul className="interests-list">
                {learner.interests.map((interest: string, index: number) => (
                  <li key={index} className="interests-item">{interest}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="course-lists">
            <Typography variant="h5" className="courses-title">Courses Enrolled</Typography>
            <div className="courses-container">
              {courses.map((course) => (
                <div key={course.id} className="course" onClick={() => navigateToCourse(course.id)}>
                  <div className="course-header">
                    <img src={course.image} alt={course.title} className="course-image" />
                    <Typography variant="h6" className="course-title">{course.title}</Typography>
                  </div>
                  {/* <Typography variant="body2" className="course-progress-text">{`Progress: ${course.progress}%`}</Typography>
                  <LinearProgress variant="determinate" value={course.progress} /> */}
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
        <DialogTitle>{dialogAction === 'blacklist' ? 'Blacklist Learner' : 'Unblacklist Learner'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {dialogAction} this learner?
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

export default LearnerDetail;
