/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
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
    <Card className="course-list-dashboard">
      <CardHeader title={<span className="title">{title}</span>} />
      <CardContent>
        {courses.length === 0 ? (
          <Typography variant="body1">No courses available</Typography>
        ) : (
          courses.map((course) => (
            <CourseItem key={course.id} course={course} onCourseClick={onCourseClick} />
          ))
        )}
      </CardContent>
    </Card>
  );
};

const CourseItem = ({ course, onCourseClick }: { course: CourseItem; onCourseClick: (courseId: string) => void }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    let imageUrl: string | null = null;

    const fetchImage = async () => {
      try {
        const response = await fetch(`https://codebolanon.commesr.io/api/${course.thumbnail}`, {
          headers: { Authorization: `bearer ${localStorage.getItem("adminToken")}` },
        });
        if (!response.ok) throw new Error("Failed to fetch image");

        const blob = await response.blob();
        imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
        setImageSrc("/Image/anime1.jpg"); // Fallback image
      }
    };

    fetchImage();

    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [course.thumbnail]);

  return (
    <div key={course.id} className="course" onClick={() => onCourseClick(course.id.toString())}>
      <div className="course-header">
        <img
          src={imageSrc || "/Image/anime2.jpg"}
          alt={course.title}
          className="course-image"
        />
        <div className="course-details">
          <Typography variant="subtitle1" className="course-title">
            {course.title}
          </Typography>
          <Typography
            variant="body2"
            className="course-description"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              margin: "4px 0",
            }}
          >
            {course.description}
          </Typography>
          <Typography variant="body2" className="course-price">
            Price: {course.price}
          </Typography>
          <Typography variant="body2" className="course-lessons">
            Lessons: {course.lessons_count || 0}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default CourseList;
