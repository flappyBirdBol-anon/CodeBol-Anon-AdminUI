/* eslint-disable @next/next/no-img-element */
"use client"
import { BarChart, Download } from "lucide-react"
import { Button, Select, MenuItem, Typography } from '@mui/material'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import Link from 'next/link'
import LearnerProfileList from './LearnerProfileList' 

ChartJS.register(ArcElement, Tooltip, Legend)
import './learners.css' // Import the CSS file

export default function LearnersPage() {
  const learners = [
    { name: 'Adrianne', image: './Image/kat.jpg' },
    { name: 'Charlie', image: './Image/burritocat.webp' },
    { name: 'Jhobert', image: './Image/Anime.jpg' },
    { name: 'Jessa', image: './Image/kat.jpg' },
    { name: 'Brianne', image: './Image/burritocat.webp' },
    { name: 'Tim', image: './Image/kat.jpg' },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">  
          <img src="/logo/170x100.png" alt="Logo" className="avatar" />
          <Typography variant="h5" className="title">FlappyBords</Typography>
        </div>

        <nav className="sidebar-nav">

          {["Dashboard", "Trainers"].map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`} passHref>
              <Button variant="text" className="button" startIcon={<BarChart />}>
                {item}
              </Button>
            </Link>
          ))}

          <Link href="/learners" passHref>
            <Button variant="contained" className="button active" startIcon={<BarChart />}>
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
          <Typography variant="body2" className="footer-text">© 2021 Company Name</Typography>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <Typography variant="h4" className="title">Learners Page</Typography>
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

        {/* Learner Profiles */}
        <div className="learner-profiles">
        <LearnerProfileList learners={learners} />
        </div>
      </div>
    </div>
  )
}
