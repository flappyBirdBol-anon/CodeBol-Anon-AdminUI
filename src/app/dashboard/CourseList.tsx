/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import axios from "axios";

// Define the interface based on what your API actually returns
interface CourseItem {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: string;
  user_id: number;
  created_at: string;
  lessons_count: number;
}

interface CourseListProps {
  title: string;
  courses: CourseItem[];
  onCourseClick: (courseId: string) => void; // Add the onCourseClick prop
}

const CourseList: React.FC<CourseListProps> = ({ title, courses = [], onCourseClick }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    setToken(storedToken);

    if (storedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    return () => {
      delete axios.defaults.headers.common["Authorization"];
    };
  }, []);

  useEffect(() => {
    return () => {
      // Reset state on unmount
      setToken(null);
    };
  }, []);

  return (
    <div className="course-list">
      {courses.length === 0 ? (
        <Typography variant="body1" sx={{ padding: "1rem", color: "rgba(255, 255, 255, 0.7)", textAlign: "center" }}>
          No courses available
        </Typography>
      ) : (
        courses.map((course) => (
          <CourseItem key={course.id} course={course} onCourseClick={onCourseClick} />
        ))
      )}
    </div>
  );
};

const CourseItem = ({ course, onCourseClick }: { course: CourseItem; onCourseClick: (courseId: string) => void }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) return;
        
        const response = await fetch(`https://codebolanon.commesr.io/api/${course.thumbnail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setImageSrc(imageUrl);
          
          // Return the URL for cleanup
          return imageUrl;
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
      return null;
    };

    // Start loading the image immediately
    let imageUrl: string | null = null;
    loadImage().then(url => {
      if (url) {
        imageUrl = url;
      }
    });

    // Cleanup function
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [course.thumbnail]);

  // Format the price to display consistently
  const formatPrice = (price: string) => {
    if (!price) return 'Free';
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? price : `$${numPrice.toFixed(2)}`;
  };

  return (
    <div key={course.id} className="dashboard-course" onClick={() => onCourseClick(course.id.toString())}>
      <div className="dashboard-course-header">
        <img
          src={imageSrc || "/Image/blank.jpg"}
          alt={course.title}
          className="dashboard-course-image"
        />
        <div className="dashboard-course-details">
          <Typography variant="subtitle1" className="dashboard-course-title">
            {course.title}
          </Typography>
          <Typography
            variant="body2"
            className="dashboard-course-description"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              margin: "4px 0",
            }}
          >
            {course.description}
          </Typography>
          <div className="dashboard-course-meta">
            <Typography variant="body2" className="dashboard-course-price">
              {formatPrice(course.price)}
            </Typography>
            <Typography variant="body2" className="dashboard-course-lessons">
              {course.lessons_count || 0} Lessons
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseList;
