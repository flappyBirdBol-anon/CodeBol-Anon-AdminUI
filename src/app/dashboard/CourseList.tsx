/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

const CourseList = ({ title, courses }: { title: string; courses: { title: string; progress: number; enrolled: string; image: string }[] }) => {
  return (
    <Card className="course-list">
      <CardHeader title={<span className="title">{title}</span>} />
      <CardContent>
        {courses.map((course) => (
          <div key={course.title} className="course">
            <div className="course-header">
              <img src={course.image} alt={course.title} className="course-image" />
              <Typography variant="subtitle1">{course.title}</Typography>
              <Typography variant="body2" className="progress">{course.progress}% {course.enrolled}</Typography>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${course.progress}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CourseList;