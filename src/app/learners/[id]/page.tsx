/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";  

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 
import { Typography, Card, CardContent, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import { useRouter } from 'next/navigation'
import './learnerprofile.css';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useAuth } from '../../components/AuthContext';
import axios from 'axios';

interface Learner {
  id: string;
  name: string;
  image: string;
  description: string;
  interests: string[]; // This will now include both interests and stacks
  email: string; 
  isActive: boolean;
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
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [registeredCourses, setRegisteredCourses] = useState<any[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

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

            const learner: Learner = {
              id: user.id || id,
              name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
              image: user.profile_picture || '/Image/blank.jpg',
              description: user.description || 'No description available.',
              interests: [...(user.interests || []), ...userStacks], // Merge interests and stacks
              email: user.email || 'No email available',
              isActive: user.is_active
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
        if (!learner?.image) return;
  
        try {
          const response = await fetch(`https://codebolanon.commesr.io/api/${learner.image}`, {
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
    }, [learner?.image]);

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
    const fetchRegisteredCourses = async () => {
      setIsLoadingCourses(true);
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      try {
        const registrationsResponse = await axios.get('https://codebolanon.commesr.io/api/registrations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const coursesResponse = await axios.get('https://codebolanon.commesr.io/api/courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Registrations Response:', registrationsResponse.data);
        console.log('Courses Response:', coursesResponse.data);

        const registrationsData = registrationsResponse.data.data || registrationsResponse.data;
        const coursesData = coursesResponse.data.data || coursesResponse.data;

        if (Array.isArray(registrationsData) && Array.isArray(coursesData)) {
          const userRegistrations = registrationsData.filter((registration: any) => {
            console.log('Registration:', registration);
            return registration.user_id == id; // Use loose equality to handle potential type differences
          });
          console.log('User Registrations:', userRegistrations);

          const userCourses = await Promise.all(userRegistrations.map(async (registration: any) => {
            const course = coursesData.find((course: any) => {
              console.log('Course:', course);
              return course.id === registration.course_id;
            });
            if (course) {
              course.image = await fetchCourseImage(course.thumbnail);
            }
            console.log('Mapped Course:', course);
            return course;
          }).filter((course: any) => course !== undefined)); // Filter out undefined courses

          console.log('User Courses:', userCourses);
          setRegisteredCourses(userCourses);
        } else {
          console.error('Unexpected data structure:', { registrations: registrationsResponse.data, courses: coursesResponse.data });
        }
      } catch (error) {
        console.error('Error fetching registered courses:', error);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchRegisteredCourses();
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
        alert('Learner has been blacklisted.');
        setLearner((prevLearner) => prevLearner ? { ...prevLearner, isActive: false } : prevLearner);
      } else if (dialogAction === 'unblacklist') {
        await axios.put(`https://codebolanon.commesr.io/api/unblacklist/${id}`, {}, {
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
      setLearner(null);
      setIsLoading(true);
      setError(null);
      setAdminProfile(null);
      setSidebarVisible(false);
      setOpenDialog(false);
      setDialogAction(null);
      setImageSrc(null);
      setRegisteredCourses([]);
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

            <Button variant="text" className="button" startIcon={<PersonOutlinedIcon />} onClick={() => navigateTo('/trainers')}>
              Trainers
            </Button>

            <Button variant="contained" className="button active" startIcon={<GroupIcon />} onClick={() => navigateTo('/learners')}>
              Learners
            </Button>
            
            <Button variant="text" className="button" startIcon={<SchoolIcon />} onClick={() => navigateTo('/courses')}>
              Courses
            </Button>

            <Button variant="text" className="button" startIcon={<ExitToAppIcon />} onClick={handleLogoutClick}>
              Logout
            </Button>
          </nav>
          
          <div className="sidebar-footer">
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
              <img src={imageSrc || "/Image/anime2.jpg"} alt={learner.name} className="learner-image" />
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
              {isLoadingCourses ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <CircularProgress />
                  <Typography variant="body1" style={{ marginTop: '1rem' }}>Loading courses...</Typography>
                </div>
              ) : (
                registeredCourses.map((course) => (
                  <div key={course.id} className="learner-course" onClick={() => navigateToCourse(course.id)}>
                    <div className="learner-course-header">
                      <img src={course.image} alt={course.title} className="learner-course-image" />
                      <div className="learner-course-info">
                        <Typography variant="h6" className="learner-course-title">{course.title}</Typography>
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

export default LearnerDetail;
