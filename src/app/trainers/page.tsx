/* eslint-disable @next/next/no-img-element */
"use client"
import { BarChart, Download } from "lucide-react"
import { Button, Select, MenuItem, Typography } from '@mui/material'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import Link from 'next/link'
import TrainerProfileList from './TrainerProfileList' 

ChartJS.register(ArcElement, Tooltip, Legend)
import './trainers.css' // Import the CSS file

export default function TrainerPage() {
  const trainer = [
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

          {["Dashboard"].map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`} passHref>
              <Button variant="text" className="button" startIcon={<BarChart />}>
                {item}
              </Button>
            </Link>
          ))}

          <Link href="/trainers" passHref>
            <Button variant="contained" className="button active" startIcon={<BarChart />}>
              Trainers
            </Button>
          </Link>

          {["Learners"].map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`} passHref>
              <Button variant="text" className="button" startIcon={<BarChart />}>
                {item}
              </Button>
            </Link>
          ))}

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
          <Typography variant="h4" className="title">Trainer Page</Typography>
          <Button variant="outlined" className="button" startIcon={<Download />}>
            Download
          </Button>
        </div>  

        {/* Filters */}
        <div className="filters">
          <Select defaultValue="all-stack">
            <MenuItem value="all-stack">All Stacks</MenuItem>
            <MenuItem value="flutter">Flutter</MenuItem>
            <MenuItem value="react">React</MenuItem>
            <MenuItem value="c#">C#</MenuItem>
            <MenuItem value="c++">C++</MenuItem>
            <MenuItem value="unity">Unity</MenuItem>
            <MenuItem value="laravel">Laravel</MenuItem>
          </Select>

          <Select defaultValue="all">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="learner">Learners</MenuItem>
            <MenuItem value="trainer">Trainer</MenuItem>
          </Select>

          <Select defaultValue="all">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="development">Development</MenuItem>
            <MenuItem value="design">Design</MenuItem>
          </Select>
        </div>

        {/* Trainer Profiles */}
        <div className="trainer-profiles">
        <TrainerProfileList trainers={trainer} />
        </div>
      </div>
    </div>
  )
}
