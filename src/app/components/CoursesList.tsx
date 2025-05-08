/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Typography, TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material';

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

interface CoursesListProps {
  courses: Course[];
  title: string;
  onCourseClick: (courseId: string) => void;
}

const CoursesList: React.FC<CoursesListProps> = ({ courses, title, onCourseClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('A-Z');
  const [imagesMap, setImagesMap] = useState<Record<number, string>>({});

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortOrder(event.target.value as string);
  };

  // Fetch course images
  useEffect(() => {
    const fetchImages = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const images: Record<number, string> = {};
      
      for (const course of courses) {
        try {
          const response = await fetch(`https://codebolanon.commesr.io/api/${course.thumbnail}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.ok) {
            const blob = await response.blob();
            images[course.id] = URL.createObjectURL(blob);
          } else {
            images[course.id] = '/Image/anime2.jpg'; // Fallback image
          }
        } catch (error) {
          console.error('Error fetching image:', error);
          images[course.id] = '/Image/anime2.jpg'; // Fallback image
        }
      }
      
      setImagesMap(images);
    };

    fetchImages();
  }, [courses]);

  // Separate cleanup effect
  useEffect(() => {
    return () => {
      Object.values(imagesMap).forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagesMap]);

  const sortedCourses = [...courses].sort((a, b) => {
    if (sortOrder === 'A-Z') {
      return a.title.localeCompare(b.title);
    } else if (sortOrder === 'Z-A') {
      return b.title.localeCompare(a.title);
    } else if (sortOrder === 'price-asc') {
      return parseFloat(a.price) - parseFloat(b.price);
    } else if (sortOrder === 'price-desc') {
      return parseFloat(b.price) - parseFloat(a.price);
    } else if (sortOrder === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortOrder === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    return 0;
  });

  const filteredCourses = sortedCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="courses-page-list">
      <CardHeader title={<span className="title">{title}</span>} />
      <CardContent>
        <div className="courses-page-search-filter">
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            className="courses-page-search"
          />
          <Select className="courses-page-filters" value={sortOrder} onChange={handleSortChange}>
            <MenuItem value="A-Z">A - Z</MenuItem>
            <MenuItem value="Z-A">Z - A</MenuItem>
            <MenuItem value="price-asc">Price: Low to High</MenuItem>
            <MenuItem value="price-desc">Price: High to Low</MenuItem>
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
          </Select>
        </div>
        <div className="courses-page-grid">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="courses-page-item"
              onClick={() => onCourseClick(course.id.toString())}
            >
              <img 
                src={imagesMap[course.id] || '/Image/anime2.jpg'} 
                alt={course.title} 
                className="courses-page-image" 
                style={{ objectPosition: 'center center' }}
              />
              <div className="courses-page-info">
                <Typography variant="subtitle1" className="courses-page-title">{course.title}</Typography>
                <Typography 
                  variant="body2" 
                  className="courses-page-description"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    margin: "8px 0",
                    minHeight: "60px"
                  }}
                >
                  {course.description}
                </Typography>
                <Typography variant="body2" className="courses-page-price">Price: {course.price}</Typography>
                <Typography variant="body2" className="courses-page-lessons">Lessons: {course.lessons_count || 0}</Typography>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoursesList; 