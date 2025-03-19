/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Typography, Card, CardContent, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
// import { courses } from '../../learners/[id]/page';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useAuth } from '../../components/AuthContext';
import './courseDetail.css';
import courses from '@/app/trainers/[id]/page';

const comments = [
  { id: '1', courseId: '1', text: 'Great course!', author: 'Adrianne' },
  { id: '2', courseId: '2', text: 'Very informative.', author: 'Charlie' },
  { id: '3', courseId: '3', text: 'Wow.', author: 'Adrianne' },
  // Add more comments as needed
];

const CourseDetail = () => {
  const { id } = useParams() as { id: string };
  const course = courses.find((course) => course.id === id);
  const courseComments = comments.filter((comment) => comment.courseId === id);

  const { logout } = useAuth();
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  if (!course) {
    return <Typography variant="h5">Course not found</Typography>;
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
            <Button variant="text" className="button" startIcon={<DashboardIcon />} onClick={() => navigateTo('/dashboard')}>
              Dashboard
            </Button>

            <Button variant="contained" className="button active" startIcon={<PersonOutlinedIcon />} onClick={() => navigateTo('/trainers')}>
              Trainers
            </Button>

            <Button variant="text" className="button" startIcon={<GroupOutlinedIcon />} onClick={() => navigateTo('/learners')}>
              Learners
            </Button>

            <Button variant="text" className="button" startIcon={<ExitToAppIcon />} onClick={logout}>
              Logout
            </Button>
          </nav>

          <div className="sidebar-footer">
            <img src="/logo/170x100.png" alt="Logo" className="adminavatar" />
            <Typography variant="body2" className="footer-text">Admin</Typography>
            <Typography variant="body2" className="footer-text2">© 2025 Company Name</Typography>
            <Typography variant="body2" className="footer-text2">Created by the FlappyBords CodeBol-anon team</Typography>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <Card className="course-card">
            <CardContent className="course-card-content">
              <div className="course-header">
                <img src={course.image} alt={course.title} className="course-image" />
                <Typography variant="h4" className="course-title">{course.title}</Typography>
              </div>
            </CardContent>
          </Card>

          <div className="comments-section">
            <Typography variant="h5" className="comments-title">Comments</Typography>
            {courseComments.map((comment) => (
              <Card key={comment.id} className="comment-card">
                <CardContent>
                  <Typography variant="body1" className="comment-text">{comment.text}</Typography>
                  <Typography variant="body2" className="comment-author">- {comment.author}</Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default (CourseDetail);
