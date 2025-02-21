/* eslint-disable @next/next/no-img-element */
"use client"
import { BarChart, Download } from "lucide-react"
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import { Button, Select, MenuItem, Typography } from '@mui/material'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import Link from 'next/link'
import StatsList from './StatsList'
import CourseList from './CourseList'
import { useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend)
import './dashboard.css' // Import the CSS file

export default function DashboardPage() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

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
  }

  const labels = {
    enrolled: learnerActivityData.datasets[0].data[0].toString(),
    notyetenrolled: learnerActivityData.datasets[0].data[1].toString(),
  }

  const stats = [
    { title: 'Monthly Active Users', value: '2,654' },
    { title: '# of Users interested in Most Popular Stack', value: '354' },
    { title: 'Most popular stack of the Month', value: 'Flutter' },
    { title: 'Most users are located in:', value: 'Tagbilaran' },
    { title: 'Current Revenue for the Month', value: '$64,342' },
    { title: 'Learner Activity', value: '', chart: true, chartData: learnerActivityData, labels: labels },
  ];

  const leastViewedCourses = [
    { title: "Unity | Learning with Bableh", progress: 12, enrolled: "Enrolled", image: "./Image/Anime.jpg"  },
    { title: "C | Creating a website", progress: 26, enrolled: "Enrolled", image: "./Image/kat.jpg"  },
    { title: "C++ | Creating an interactive website", progress: 45, enrolled: "Enrolled", image: "./Image/group.jpg"  },
  ];

  const mostViewedCourses = [
    { title: "C# | Zackhary's Portfolio", progress: 95, enrolled: "Enrolled", image: "./Image/kat.jpg" },
    { title: "Flutter | Jelah's portfolio", progress: 92, enrolled: "Enrolled", image: "./Image/Anime.jpg" },
    { title: "Python | June's code", progress: 89, enrolled: "Enrolled", image: "./Image/group.jpg" },
  ];

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
          <img src="/logo/170x100.png" alt="Logo" className="avatar" />
          <Typography variant="h5" className="title">Dashboard</Typography>
        </div>

        <nav className="sidebar-nav">
          <Link href="/dashboard" passHref>
            <Button variant="contained" className="button active" startIcon={<DashboardIcon />}>
              Dashboard
            </Button>
          </Link>

          <Link href="/trainers" passHref>
            <Button variant="text" className="button" startIcon={<PersonOutlinedIcon />}>
              Trainers
            </Button>
          </Link>

          <Link href="/learners" passHref>
            <Button variant="text" className="button" startIcon={<GroupOutlinedIcon />}>
              Learners
            </Button>
          </Link>
        </nav>
        
        <div className="sidebar-support">
          <Typography variant="subtitle1" className="support-title">Support</Typography>
          {["Get Started", "Settings"].map((item) => (
            <Button key={item} variant="text" className="button" startIcon={<BarChart />}>
              {item}
            </Button>
          ))}
        </div>
        <div className="sidebar-footer">
          <img src="/logo/170x100.png" alt="Logo" className="adminavatar" />
          <Typography variant="body2" className="footer-text">Admin</Typography>
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

        {/* Filters */}
        <div className="filters">
          <Select defaultValue="all-time">
            <MenuItem value="all-time">All-time</MenuItem>
            <MenuItem value="this-month">This Month</MenuItem>
            <MenuItem value="last-month">Last Month</MenuItem>
          </Select>

          <Select defaultValue="all">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="trainers">Trainers</MenuItem>
            <MenuItem value="learners">Learners</MenuItem>
          </Select>

          <Select defaultValue="all">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="development">Development</MenuItem>
            <MenuItem value="design">Design</MenuItem>
          </Select>
        </div>

        {/* Stats List */}
        <StatsList stats={stats} />
        
        {/* Course Lists */}
        <div className="course-lists">
          <CourseList title="Least Viewed Courses" courses={leastViewedCourses} />
          <CourseList title="Most Viewed Courses" courses={mostViewedCourses} />
        </div>
      </div>
    </div>
  )
}