/* eslint-disable @next/next/no-img-element */
"use client"
import { Download } from "lucide-react"
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Button, Typography, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useRouter } from 'next/navigation'
import StatsList from './StatsList'
import CourseList from './CourseList'
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend)
import './dashboard.css' // Import the CSS file

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
}

interface AdminProfile {
  email: string;
  first_name: string;
  last_name: string;
}

const DashboardPage = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [leastViewedCourses, setLeastViewedCourses] = useState<Course[]>([]);
  const [mostViewedCourses, setMostViewedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [activeUsers, setActiveUsers] = useState<number>(0);

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
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://143.198.197.240/api/courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.data) {
          const courses = response.data.data;
          
          // For demonstration, sort by id - in production you'd sort by actual view metrics
          const sortedCourses = [...courses];
          
          // Set the first 3 courses as least viewed and last 3 as most viewed
          setLeastViewedCourses(sortedCourses.slice(0, 3));
          
          // Reverse the mostViewedCourses array to show them in descending order
          setMostViewedCourses(sortedCourses.slice(-3).reverse());
          
          console.log('Courses fetched successfully:', courses);
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

  useEffect(() => {
    const fetchActiveUsers = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      try {
        const response = await axios.get('http://143.198.197.240/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data && response.data.data) {
          const users = response.data.data;
          const activeUserCount = users.filter((user: { is_active: boolean }) => user.is_active).length;
          setActiveUsers(activeUserCount);
        }
      } catch (error) {
        console.error('Error fetching active users:', error);
      }
    };

    fetchActiveUsers();
  }, []);

  const learnerActivityData = {
    labels: ['Enrolled', 'Not yet Enrolled'],
    datasets: [
      {
        label: 'Number of Learners Enrolled',
        data: [120, 100],
        backgroundColor: ['#71a3c1', '#f5945c'],
        borderColor: ['#71a3c1', '#f5945c'],
        borderWidth: 1,
      },
    ],
  };

  const labels = {
    enrolled: learnerActivityData.datasets[0].data[0].toString(),
    notyetenrolled: learnerActivityData.datasets[0].data[1].toString(),
  };

  const stats = [
    { title: 'Monthly Active Users', value: activeUsers.toString() },
    { title: '# of Users interested in Most Popular Stack', value: '354' },
    { title: 'Most popular stack of the Month', value: 'Flutter' },
    { title: 'Most users are located in:', value: 'Tagbilaran' },
    { title: 'Current Revenue for the Month', value: '$64,342' },
    { title: 'Learner Activity', value: '', chart: true, chartData: learnerActivityData, labels: labels },
  ];

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
            <Button 
              variant="contained" 
              className="button active" 
              startIcon={<DashboardIcon />} 
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
            <Typography variant="h4" className="title">Dashboard</Typography>
            <Button variant="outlined" className="button" startIcon={<Download />}>
              Download
            </Button>
          </div>  

          {/* Stats List */}
          <StatsList stats={stats} />
          
          {/* Course Lists */}
          <div className="course-lists">
            {isLoading ? (
              <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '2rem' }}>
                <CircularProgress />
                <Typography variant="body1" style={{ marginTop: '1rem' }}>Loading courses...</Typography>
              </div>
            ) : error ? (
              <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '2rem' }}>
                <Typography color="error">{error}</Typography>
              </div>
            ) : (
              <>
                <CourseList title="Least Viewed Courses" courses={leastViewedCourses} />
                <CourseList title="Most Viewed Courses" courses={mostViewedCourses} />
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;