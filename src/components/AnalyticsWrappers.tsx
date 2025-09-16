import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentAnalytics from '../pages/StudentAnalytics';
import ClassAnalytics from '../pages/ClassAnalytics';
import SubjectAnalytics from '../pages/SubjectAnalytics';

export const StudentAnalyticsWrapper: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  if (!studentId) {
    return <div>Student ID not found</div>;
  }

  return (
    <StudentAnalytics 
      studentId={studentId} 
      onBack={() => navigate('/staff/statistics')}
    />
  );
};

export const ClassAnalyticsWrapper: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();

  if (!classId) {
    return <div>Class ID not found</div>;
  }

  return (
    <ClassAnalytics 
      classId={classId} 
      onBack={() => navigate('/staff/statistics')}
      onStudentClick={(studentId) => navigate(`/staff/statistics/student/${studentId}`)}
    />
  );
};

export const SubjectAnalyticsWrapper: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();

  if (!subjectId) {
    return <div>Subject ID not found</div>;
  }

  return (
    <SubjectAnalytics 
      subjectId={subjectId} 
      onBack={() => navigate('/staff/statistics')}
      onClassClick={(classId) => navigate(`/staff/statistics/class/${classId}`)}
    />
  );
};
