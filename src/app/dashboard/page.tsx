/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Download } from "lucide-react"
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Button, Typography, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js'
import { useRouter } from 'next/navigation'
import StatsList from './StatsList'
import CourseList from './CourseList'
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title)
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

interface Registration {
  id: number;
  rating: number | null;
  feedback: string | null;
  is_reported: number;
  report_reason: string | null;
  is_paid: number;
  course_id: number;
  user_id: number | null;
  created_at: string;
  updated_at: string;
}

// Define the stat item interface to allow for the chartType property
interface StatItem {
  title: string;
  value: string;
  chart?: boolean;
  chartData?: any;
  chartType?: string;
  labels?: any;
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
  const [currentRevenue, setCurrentRevenue] = useState<string>("$0");
  const [mostPopularStack, setMostPopularStack] = useState<string>('');
  const [mostPopularStackUsers, setMostPopularStackUsers] = useState<number>(0);
  const [registrationData, setRegistrationData] = useState<Registration[]>([]);
  const [learnerActivityData, setLearnerActivityData] = useState<any>(null);
  const [registrationLabels, setRegistrationLabels] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setIsLoading(false);
        return;
      }

      try {
        const [coursesResponse, registrationsResponse, usersResponse, stacksResponse] = await Promise.all([
          axios.get('http://143.198.197.240/api/courses', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get('http://143.198.197.240/api/registrations', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get('http://143.198.197.240/api/users', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get('http://143.198.197.240/api/stacks', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (coursesResponse.data && coursesResponse.data.data && registrationsResponse.data && registrationsResponse.data.data && usersResponse.data && usersResponse.data.data) {
          const courses = coursesResponse.data.data;
          const registrations = registrationsResponse.data.data;
          setRegistrationData(registrations);
          
          // Process registration data for line chart
          processRegistrationData(registrations);

          // Count the number of registrations for each course
          const courseViews = courses.map((course: { id: any; }) => ({
            ...course,
            views: registrations.filter((reg: { course_id: any; }) => reg.course_id === course.id).length
          }));

          // Sort courses by views
          const sortedCourses = courseViews.sort((a: { views: number; }, b: { views: number; }) => a.views - b.views);

          // Set the first 3 courses as least viewed and last 3 as most viewed
          setLeastViewedCourses(sortedCourses.slice(0, 3));
          setMostViewedCourses(sortedCourses.slice(-3).reverse());

          console.log('Courses fetched successfully:', courses);
        } else {
          setError('Invalid data structure received from API');
        }

        // Calculate most popular stack
        if (stacksResponse.data && stacksResponse.data.data && usersResponse.data && usersResponse.data.data) {
          const stacks = stacksResponse.data.data;
          const users = usersResponse.data.data;

          console.log('Stacks:', stacks);
          console.log('Users:', users);

          // Create a map to count stack usage
          const stackUsageCount = new Map<string, number>();

          // Count stack usage across all users
          users.forEach((user: any) => {
            if (user.stacks && Array.isArray(user.stacks)) {
              user.stacks.forEach((stack: any) => {
                const currentCount = stackUsageCount.get(stack.tags) || 0;
                stackUsageCount.set(stack.tags, currentCount + 1);
              });
            }
          });

          console.log('Stack usage count:', Object.fromEntries(stackUsageCount));

          // Find the most popular stack
          let maxCount = 0;
          let mostPopularStackName = '';

          stackUsageCount.forEach((count, stackName) => {
            if (count > maxCount) {
              maxCount = count;
              mostPopularStackName = stackName;
            }
          });

          console.log('Most popular stack:', { name: mostPopularStackName, count: maxCount });

          setMostPopularStack(mostPopularStackName || 'No stack found');
          setMostPopularStackUsers(maxCount);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process registration data for line chart
  const processRegistrationData = (registrations: Registration[]) => {
    if (!registrations || registrations.length === 0) return;

    // Sort registrations by created_at date
    const sortedRegistrations = [...registrations].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Get date range - use last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // Create array of all days in the range
    const days: Date[] = [];
    const currentDay = new Date(thirtyDaysAgo);
    while (currentDay <= today) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    // Initialize counts for each day
    const registrationsByDay: { [key: string]: number } = {};
    days.forEach(day => {
      const dateKey = day.toISOString().split('T')[0];
      registrationsByDay[dateKey] = 0;
    });

    // Count registrations by day
    sortedRegistrations.forEach(reg => {
      const regDate = new Date(reg.created_at);
      const dateKey = regDate.toISOString().split('T')[0];
      
      // Only count if the date is within our range
      if (regDate >= thirtyDaysAgo && regDate <= today) {
        registrationsByDay[dateKey] = (registrationsByDay[dateKey] || 0) + 1;
      }
    });

    // Format dates for display and get counts
    const formattedDates = days.map(day => {
      return day.toLocaleString('default', { month: 'short', day: 'numeric' });
    });
    
    const dayCounts = days.map(day => {
      const dateKey = day.toISOString().split('T')[0];
      return registrationsByDay[dateKey] || 0;
    });

    // Create cumulative counts
    let cumulativeCount = 0;
    const cumulativeCounts = dayCounts.map(count => {
      cumulativeCount += count;
      return cumulativeCount;
    });

    setRegistrationLabels(formattedDates);
    
    // Update learner activity data for line chart
    setLearnerActivityData({
      labels: formattedDates,
      datasets: [
        {
          label: 'Total Registrations',
          data: cumulativeCounts,
          borderColor: '#71a3c1',
          backgroundColor: 'rgba(113, 163, 193, 0.2)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        }
      ],
    });

    // Log registration data to console for debugging
    console.log('Registration data processed:', { 
      registrationData: registrations.length,
      labels: formattedDates, 
      dataPoints: cumulativeCounts 
    });
  };

  useEffect(() => {
    // Log when chart data changes
    if (learnerActivityData && registrationLabels.length > 0) {
      console.log('Chart data updated', { 
        labels: registrationLabels,
        datasets: learnerActivityData.datasets
      });
    }
  }, [learnerActivityData, registrationLabels]);

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

  useEffect(() => {
    const fetchCurrentRevenue = async () => {
      console.log('Fetching current revenue...'); // Debugging log to confirm function execution

      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.error('No token found'); // Debugging log for missing token
        return;
      }

      try {
        const response = await axios.get('http://143.198.197.240/api/transactions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('API Response:', response.data); // Debugging log for API response

        // Adjust this based on the actual structure of the API response
        const transactions = response.data.data || response.data; // Fallback to response.data if data is not nested

        if (Array.isArray(transactions)) {
          const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed
          const currentYear = new Date().getFullYear();

          // Filter transactions for the current month and year
          const monthlyTransactions = transactions.filter((transaction: { created_at: string }) => {
            const transactionDate = new Date(transaction.created_at);
            return (
              transactionDate.getMonth() + 1 === currentMonth &&
              transactionDate.getFullYear() === currentYear
            );
          });

          console.log('Filtered Transactions:', monthlyTransactions); // Debugging log for filtered transactions

          // Calculate total revenue
          const totalRevenue = monthlyTransactions.reduce((sum: number, transaction: { amount: string }) => {
            const amount = parseFloat(transaction.amount);
            return sum + (isNaN(amount) ? 0 : amount); // Handle invalid amounts gracefully
          }, 0);

          console.log('Total Revenue:', totalRevenue); // Debugging log for total revenue

          setCurrentRevenue(`$${totalRevenue.toFixed(2)}`);
        } else {
          console.error('Unexpected API response structure:', response.data); // Debugging log for unexpected structure
        }
      } catch (error) {
        console.error('Error fetching transactions:', error); // Debugging log for errors
      }
    };

    fetchCurrentRevenue();
  }, []);

  useEffect(() => {
    return () => {
      // Reset state on unmount
      setLeastViewedCourses([]);
      setMostViewedCourses([]);
      setIsLoading(true);
      setError(null);
      setAdminProfile(null);
      setSidebarVisible(false);
      setLogoutDialogOpen(false);
      setActiveUsers(0);
      setRegistrationData([]);
      setLearnerActivityData(null);
      setRegistrationLabels([]);
    };
  }, []);

  // Add this to use the registrationData variable
  useEffect(() => {
    // Count total registrations for data validation
    if (registrationData.length > 0) {
      console.log(`Total registrations loaded: ${registrationData.length}`);
    }
  }, [registrationData]);

  const stats: StatItem[] = [
    { title: 'Current Active Users', value: activeUsers.toString() },
    { title: '# of Users interested in Most Popular Stack', value: mostPopularStackUsers.toString() },
    { title: 'Most popular stack of the Month', value: mostPopularStack || 'Loading...' }, // Add fallback
    { title: 'Current Revenue', value: currentRevenue },
    { 
      title: 'User Registrations Over Time', 
      value: '', 
      chart: true, 
      chartData: learnerActivityData || {
        labels: ['Loading...'],
        datasets: [{ data: [0], borderColor: '#71a3c1' }]
      }, 
      chartType: 'line',
      labels: {} 
    },
  ];

  console.log('Stats array:', stats); // Debug log to verify data is being passed correctly

  // Add a function to handle Excel export
  const handleExportToExcel = async () => {
    try {
      setIsExporting(true);
      
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      
      // Create a main dashboard stats sheet
      const dashboardStats = [
        { 'Metric': 'Current Active Users', 'Value': activeUsers.toString() },
        { 'Metric': 'Users Interested in Most Popular Stack', 'Value': mostPopularStackUsers.toString() },
        { 'Metric': 'Most Popular Stack', 'Value': mostPopularStack },
        { 'Metric': 'Current Revenue', 'Value': currentRevenue },
        { 'Metric': 'Total Registrations', 'Value': registrationData.length.toString() }
      ];
      
      // Add dashboard stats sheet
      const dashboardStatsSheet = XLSX.utils.json_to_sheet(dashboardStats);
      XLSX.utils.book_append_sheet(workbook, dashboardStatsSheet, "Dashboard Summary");
      
      // Add registration data by day (as shown in chart)
      if (learnerActivityData && learnerActivityData.labels) {
        const registrationTrends = learnerActivityData.labels.map((date: string, index: number) => ({
          'Date': date,
          'Total Registrations': learnerActivityData.datasets[0].data[index]
        }));
        
        const registrationTrendsSheet = XLSX.utils.json_to_sheet(registrationTrends);
        XLSX.utils.book_append_sheet(workbook, registrationTrendsSheet, "Registration Trends");
      }
      
      // Export Least Viewed Courses
      if (leastViewedCourses.length > 0) {
        const leastViewedForExport = leastViewedCourses.map(course => ({
          'Course ID': course.id,
          'Title': course.title,
          'Description': course.description,
          'Price': course.price,
          'Lessons Count': course.lessons_count,
          'Created At': new Date(course.created_at).toLocaleString()
        }));
        
        const leastViewedSheet = XLSX.utils.json_to_sheet(leastViewedForExport);
        XLSX.utils.book_append_sheet(workbook, leastViewedSheet, "Least Viewed Courses");
      }
      
      // Export Most Viewed Courses
      if (mostViewedCourses.length > 0) {
        const mostViewedForExport = mostViewedCourses.map(course => ({
          'Course ID': course.id,
          'Title': course.title,
          'Description': course.description,
          'Price': course.price,
          'Lessons Count': course.lessons_count,
          'Created At': new Date(course.created_at).toLocaleString()
        }));
        
        const mostViewedSheet = XLSX.utils.json_to_sheet(mostViewedForExport);
        XLSX.utils.book_append_sheet(workbook, mostViewedSheet, "Most Viewed Courses");
      }
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
      
      // Save file with current date
      const today = new Date().toISOString().split('T')[0];
      const fileName = `Dashboard_Report_${today}.xlsx`;
      saveAs(data, fileName);
      
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export data. Please try again later.');
    } finally {
      setIsExporting(false);
    }
  };

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
            <Typography variant="body2" className="footer-text2">© 2025 Company Name</Typography>
            <Typography variant="body2" className="footer-text2">Created by the FlappyBords CodeBol-anon team</Typography>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="header">
            <Typography variant="h4" className="title">Dashboard</Typography>
            <Button 
              variant="outlined" 
              className="button" 
              startIcon={isExporting ? <CircularProgress size={20} /> : <Download />}
              onClick={handleExportToExcel}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : 'Download'}
            </Button>
          </div>  

          {/* Stats List */}
          <StatsList stats={stats} />
          
          {/* Course Lists */}
          <div className="course-lists-dashboard">
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
                <div className="course-list-container">
                  <div className="course-list-title">Least Viewed Courses</div>
                  <CourseList
                      courses={leastViewedCourses}
                      onCourseClick={navigateToCourse} title={""}                  
                  />
                </div>  
                <div className="course-list-container">
                  <div className="course-list-title">Most Viewed Courses</div>
                  <CourseList
                      courses={mostViewedCourses}
                      onCourseClick={navigateToCourse} title={""}                  
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;