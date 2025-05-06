/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";  

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 
import { Typography, Card, CardContent, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonIcon from '@mui/icons-material/Person';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SchoolIcon from '@mui/icons-material/School';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useRouter } from 'next/navigation'
import './trainerprofile.css'; 
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useAuth } from '../../components/AuthContext';
import axios from 'axios';

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
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [uploadedCourses, setUploadedCourses] = useState<any[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

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
        
        const response = await axios.get(`https://codebolanon.commesr.io/api/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (response.data && response.data.data) {
          const user = response.data.data;
          
          if (user) {
            console.log('Found user with matching ID:', user);

            // Fetch stacks data
            const stacksResponse = await axios.get('https://codebolanon.commesr.io/api/stacks', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            const stacks = stacksResponse.data.data || [];
            const userStacks = user.stacks?.map((stack: any) => {
              const matchingStack = stacks.find((s: any) => s.id === stack.id);
              return matchingStack ? matchingStack.tags : null;
            }).filter((tag: string | null) => tag !== null) || [];

            const trainer: Trainer = {
              id: user.id || id,
              name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
              image: user.profile_picture || '/Image/blank.jpg',
              description: user.description || '',
              expertise: [...(user.expertise || []), ...userStacks], // Merge expertise and stacks
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
        const response = await axios.get('https://codebolanon.commesr.io/api/profile/me', {
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

  useEffect(() => {
    const fetchImage = async () => {
      if (!trainer?.image) return;

      try {
        const response = await fetch(`https://codebolanon.commesr.io/api/${trainer.image}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        if (!response.ok) throw new Error("Failed to fetch image");

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
        setImageSrc("/Image/blank.jpg"); // Fallback image
      }
    };

    fetchImage();

    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [trainer?.image]);

  const fetchCourseImage = async (thumbnail: string) => {
    try {
      const response = await fetch(`https://codebolanon.commesr.io/api/${thumbnail}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (!response.ok) throw new Error("Failed to fetch image");
  
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error fetching image:", error);
      return "/Image/blank.jpg"; // Fallback image
    }
  };

  useEffect(() => {
    const fetchUploadedCourses = async () => {
      setIsLoadingCourses(true);
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      try {
        const response = await axios.get('https://codebolanon.commesr.io/api/courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Courses Response:', response.data);

        const coursesData = response.data.data || response.data;

        if (Array.isArray(coursesData)) {
          const trainerCourses = await Promise.all(coursesData.filter((course: any) => {
            console.log('Course:', course);
            return course.user_id == id; // Use user_id instead of trainer_id
          }).map(async (course: any) => {
            course.image = await fetchCourseImage(course.thumbnail);
            // Add learners enrolled count
            const registrationsResponse = await axios.get('https://codebolanon.commesr.io/api/registrations', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            course.rating = course.rating || 'No rating';
            const registrationsData = registrationsResponse.data.data || registrationsResponse.data;
            course.learnersEnrolled = registrationsData.filter((reg: any) => reg.course_id === course.id).length;
            return course;
          }));

          console.log('Trainer Courses:', trainerCourses);
          setUploadedCourses(trainerCourses);
        } else {
          console.error('Unexpected data structure:', { courses: response.data });
        }
      } catch (error) {
        console.error('Error fetching uploaded courses:', error);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchUploadedCourses();
  }, [id]);

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
        await axios.put(`https://codebolanon.commesr.io/api/blacklist/${id}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert('Trainer has been blacklisted.');
        setTrainer((prevTrainer) => prevTrainer ? { ...prevTrainer, isActive: false } : prevTrainer);
      } else if (dialogAction === 'unblacklist') {
        await axios.put(`https://codebolanon.commesr.io/api/unblacklist/${id}`, {}, {
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
    return () => {
      // Reset state on unmount
      setTrainer(null);
      setIsLoading(true);
      setError(null);
      setAdminProfile(null);
      setSidebarVisible(false);
      setOpenDialog(false);
      setDialogAction(null);
      setImageSrc(null);
      setIsLoadingCourses(true);
    };
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
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
            
            <Button variant="text" className="button" startIcon={<SchoolIcon />} onClick={() => navigateTo('/courses')}>
              Courses
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
            <Typography variant="h4" className="title">Trainer Detail</Typography>
          </div>  

          <Card className="trainer-card">
            <CardContent className="trainer-card-content">
              <div className="trainer-profile">
                <img src={imageSrc || "/Image/blank.jpg"} alt={trainer.name} className="trainer-image" />
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
              {isLoadingCourses ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <CircularProgress />
                  <Typography variant="body1" style={{ marginTop: '1rem' }}>Loading courses...</Typography>
                </div>
              ) : (
                uploadedCourses.map((course) => (
                  <div key={course.id} className="trainer-course" onClick={() => navigateToCourse(course.id)}>
                    <div className="trainer-course-header">
                      <img src={course.image} alt={course.title} className="trainer-course-image" />
                      <div className="trainer-course-info">
                        <Typography variant="h6" className="trainer-course-title">{course.title}</Typography>
                        <Typography variant="body2" className="trainer-course-enrollment">
                          Learners Enrolled: {course.learnersEnrolled}
                        </Typography>
                        <Typography variant="body2" className="trainer-course-rating">
                          Rating: {course.rating} ⭐
                        </Typography>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Blacklist/Unblacklist Dialog */}
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
  );
};

export default (TrainerDetail);
