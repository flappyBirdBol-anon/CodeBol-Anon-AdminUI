/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Typography, Card, CardContent, CircularProgress, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonIcon from '@mui/icons-material/Person';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SchoolIcon from '@mui/icons-material/School';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import axios from 'axios';
import './courseDetail.css';
import { useAuth } from '../../components/AuthContext';

const CourseDetail = () => {
  const { id } = useParams() as { id: string };
  const [course, setCourse] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [adminProfile, setAdminProfile] = useState<any | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null); // State for course image blob
  const [comments, setComments] = useState<any[]>([]); // State for comments
  const [isLoadingComments, setIsLoadingComments] = useState(true); // State for loading comments
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://codebolanon.commesr.io/api/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.data) {
          setCourse(response.data.data);
        } else {
          setError('Course not found.');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        setError('Failed to fetch course details.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchComments = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      setIsLoadingComments(true); // Set loading state to true

      try {
        const response = await axios.get('https://codebolanon.commesr.io/api/registrations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.data) {
          console.log('Registrations API Response:', response.data.data); // Debugging log

          // Filter comments for the current course
          const courseComments = response.data.data.filter(
            (registration: any) => String(registration.course_id) === id && registration.feedback
          );

          // Fetch user details and profile pictures as blobs
          const userPromises = courseComments.map(async (comment: any) => {
            try {
              const userResponse = await axios.get(`https://codebolanon.commesr.io/api/users/${comment.user_id}`, {
                headers: {
                  Authorization: `Bearer ${token}`, 
                },
              });
              if (userResponse.data && userResponse.data.data) {
                const user = userResponse.data.data;

                // Fetch user profile picture as a blob
                if (user.profile_picture) {
                  try {
                    const imageResponse = await fetch(`https://codebolanon.commesr.io/api/${user.profile_picture}`, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    if (imageResponse.ok) {
                      const blob = await imageResponse.blob();
                      user.profile_picture_blob = URL.createObjectURL(blob); // Attach blob URL
                    } else {
                      user.profile_picture_blob = '/Image/blank.jpg'; // Fallback image
                    }
                  } catch (error) {
                    console.error(`Error fetching profile picture for user ${user.id}:`, error);
                    user.profile_picture_blob = '/Image/blank.jpg'; // Fallback image
                  }
                } else {
                  user.profile_picture_blob = '/Image/blank.jpg'; // Fallback image
                }

                comment.user = user; // Attach user details to the comment
              }
            } catch (error) {
              console.error(`Error fetching user with ID ${comment.user_id}:`, error);
            }
            return comment;
          });

          const commentsWithUsers = await Promise.all(userPromises);
          setComments(commentsWithUsers);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoadingComments(false); // Set loading state to false
      }
    };

    const fetchAdminProfile = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      try {
        const response = await axios.get('https://codebolanon.commesr.io/api/profile/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.data) {
          setAdminProfile(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching admin profile:', error);
      }
    };

    fetchCourse();
    fetchComments();
    fetchAdminProfile();
  }, [id]);

  useEffect(() => {
    const fetchImage = async () => {
      if (!course?.thumbnail) return;

      try {
        const response = await fetch(`https://codebolanon.commesr.io/api/${course.thumbnail}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        });
        if (!response.ok) throw new Error('Failed to fetch image');

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error('Error fetching image:', error);
        setImageSrc('/Image/blank.jpg'); // Fallback image
      }
    };

    fetchImage();

    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [course?.thumbnail]);

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

  if (!course) {
    return <Typography variant="h5">Course not found</Typography>;
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

          <Button variant="text" className="button" startIcon={<PersonIcon />} onClick={() => navigateTo('/trainers')}>
            Trainers
          </Button>

          <Button variant="text" className="button" startIcon={<GroupOutlinedIcon />} onClick={() => navigateTo('/learners')}>
            Learners
          </Button>
          
          <Button variant="contained" className="button active" startIcon={<SchoolIcon />} onClick={() => navigateTo('/courses')}>
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
          <Typography variant="h4" className="title">Course Detail</Typography>
        </div>
        
        <Card className="course-card">
          <CardContent className="course-card-content">
            <div className="course-detail">
              <img src={imageSrc || '/Image/blank.jpg'} alt={course.title} className="course-image" />
              <div className="course-info">
                <Typography variant="h4" className="course-title">{course.title}</Typography>
                <Typography variant="body1" className="course-description">{course.description}</Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <div className="comments-section">
          <Typography variant="h5" className="comments-title">Comments</Typography>
          {isLoadingComments ? (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <CircularProgress />
              <Typography variant="body2" style={{ marginTop: '0.5rem' }}>Loading comments...</Typography>
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment: any, index: number) => (
              <Card key={index} className="comment-card">
                <CardContent>
                  <Typography variant="body1" className="comment-text">{comment.feedback}</Typography>
                  <div className="comment-author">
                    <img
                      src={comment.user?.profile_picture_blob || '/Image/blank.jpg'}
                      alt={`${comment.user?.first_name || 'Unknown'} ${comment.user?.last_name || ''}`}
                      className="comment-author-image"
                    />
                    <Typography variant="body2" className="comment-author-name">
                      {comment.user?.first_name || 'Unknown'} {comment.user?.last_name || ''}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" className="no-comments">No comments available.</Typography>
          )}
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
  );
};

export default CourseDetail;
