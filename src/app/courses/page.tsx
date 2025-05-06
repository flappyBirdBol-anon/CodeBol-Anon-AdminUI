/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import { Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SchoolIcon from '@mui/icons-material/School';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../components/AuthContext';
import CoursesList from '../components/CoursesList';
import '../dashboard/dashboard.css'; // Reuse the dashboard CSS
import './courses.css'; // Import the courses CSS

// Define interface for course data
interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: string;
  user_id: number;
  created_at: string;
  lessons_count: number;
  views?: number;
}

interface AdminProfile {
  email: string;
  first_name: string;
  last_name: string;
}

const CoursesPage = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const navigateToCourse = (courseId: string) => {
    router.push(`/courses/${courseId}`);
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

  // Fetch admin profile
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

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

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setError('No authentication token found. Please log in again.');
          setIsLoading(false);
          return;
        }

        const coursesResponse = await axios.get('https://codebolanon.commesr.io/api/courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const registrationsResponse = await axios.get('https://codebolanon.commesr.io/api/registrations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (coursesResponse.data && coursesResponse.data.data && 
            registrationsResponse.data && registrationsResponse.data.data) {
          const courses = coursesResponse.data.data;
          const registrations = registrationsResponse.data.data;
          
          // Add view count to each course
          const coursesWithViews = courses.map((course: Course) => ({
            ...course,
            views: registrations.filter((reg: any) => reg.course_id === course.id).length
          }));
          
          setCourses(coursesWithViews);
        } else {
          setError('Invalid data structure received from API');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to fetch courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setCourses([]);
      setIsLoading(true);
      setError(null);
      setAdminProfile(null);
      setLogoutDialogOpen(false);
    };
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
            <Button 
              variant="text" 
              className="button" 
              startIcon={<DashboardOutlinedIcon />} 
              onClick={() => navigateTo('/dashboard')}
            >
              Dashboard
            </Button>

            <Button 
              variant="text" 
              className="button" 
              startIcon={<PersonOutlinedIcon />} 
              onClick={() => navigateTo('/trainers')}
            >
              Trainers
            </Button>

            <Button 
              variant="text" 
              className="button" 
              startIcon={<GroupOutlinedIcon />} 
              onClick={() => navigateTo('/learners')}
            >
              Learners
            </Button>
            
            <Button 
              variant="contained" 
              className="button active" 
              startIcon={<SchoolIcon />} 
              onClick={() => navigateTo('/courses')}
            >
              Courses
            </Button>

            <Button 
              variant="text" 
              className="button" 
              startIcon={<ExitToAppIcon />} 
              onClick={handleLogoutClick}
            >
              Logout
            </Button>
          </nav>

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

          <div className="sidebar-footer">
            <Typography variant="body2" className="footer-text2">© 2025 Company Name</Typography>
            <Typography variant="body2" className="footer-text2">Created by the FlappyBords CodeBol-anon team</Typography>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="header">
            <Typography variant="h4" className="title">All Courses</Typography>
          </div>  

          {/* Courses List */}
          <div className="courses-page-container">
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <CircularProgress />
                <Typography variant="body1" style={{ marginTop: '1rem' }}>Loading courses...</Typography>
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Typography color="error">{error}</Typography>
              </div>
            ) : (
              <CoursesList
                courses={courses}
                title="All Available Courses"
                onCourseClick={navigateToCourse}
              />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CoursesPage; 