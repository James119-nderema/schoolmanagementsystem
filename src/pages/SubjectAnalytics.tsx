import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { BookOpen, TrendingUp, Award, AlertCircle, Target, Users } from 'lucide-react';

interface SubjectAnalyticsData {
  subject_info: {
    name: string;
    code: string;
    academic_year: string;
  };
  overall_average: number;
  total_assessments: number;
  total_students_assessed: number;
  highest_score: number;
  lowest_score: number;
  pass_rate: number;
  excellence_rate: number;
  class_performance: Record<string, {
    average: number;
    assessments: number;
    pass_rate: number;
  }>;
  performance_trends: Record<string, {
    average: number;
    count: number;
  }>;
  challenging_topics: string[];
  success_areas: string[];
  grade_distribution: Record<string, number>;
}

interface SubjectAnalyticsProps {
  subjectId: string;
  onBack?: () => void;
  onClassClick?: (classId: string) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const SubjectAnalytics: React.FC<SubjectAnalyticsProps> = ({ 
  subjectId, 
  onBack, 
  onClassClick 
}) => {
  const [subjectData, setSubjectData] = useState<SubjectAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjectData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('staff_access_token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const queryParams = new URLSearchParams({
        subject_id: subjectId,
        term: '1',
        academic_year: '2024-2025',
        exam_type: 'exam_1'
      });

      const response = await fetch(
        `/api/input-marks/subject-analytics/?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch subject analytics');
      }

      const data = await response.json();
      setSubjectData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subjectId) {
      fetchSubjectData();
    }
  }, [subjectId]);

  const formatClassPerformanceData = () => {
    if (!subjectData) return [];
    
    return Object.entries(subjectData.class_performance).map(([className, data]) => ({
      class: className,
      average: Math.round(data.average * 100) / 100,
      assessments: data.assessments,
      passRate: Math.round(data.pass_rate * 100) / 100
    }));
  };

  const formatTrendsData = () => {
    if (!subjectData) return [];
    
    return Object.entries(subjectData.performance_trends)
      .map(([month, data]) => ({
        month,
        average: Math.round(data.average * 100) / 100,
        assessments: data.count
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  const formatGradeDistribution = () => {
    if (!subjectData) return [];
    
    return Object.entries(subjectData.grade_distribution).map(([grade, count]) => ({
      grade,
      count,
      percentage: Math.round((count / subjectData.total_assessments) * 100)
    }));
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 75) return { label: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 60) return { label: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { label: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Subject Analytics</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
            <button 
              onClick={fetchSubjectData}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!subjectData) {
    return <div>No data available</div>;
  }

  const performanceLevel = getPerformanceLevel(subjectData.overall_average);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back
            </button>
          )}
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{subjectData.subject_info.name}</h1>
              <p className="text-gray-600">
                Code: {subjectData.subject_info.code} | {subjectData.subject_info.academic_year}
              </p>
            </div>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-lg ${performanceLevel.bgColor}`}>
          <p className={`font-medium ${performanceLevel.color}`}>
            {performanceLevel.label}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Average</p>
                <p className="text-2xl font-bold text-gray-900">{subjectData.overall_average}%</p>
              </div>
              <Award className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pass Rate</p>
                <p className="text-2xl font-bold text-gray-900">{subjectData.pass_rate}%</p>
              </div>
              <Target className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Excellence Rate</p>
                <p className="text-2xl font-bold text-gray-900">{subjectData.excellence_rate}%</p>
              </div>
              <Award className="h-6 w-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Students Assessed</p>
                <p className="text-2xl font-bold text-gray-900">{subjectData.total_students_assessed}</p>
              </div>
              <Users className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Highest Score</p>
                <p className="text-2xl font-bold text-gray-900">{subjectData.highest_score}%</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900">{subjectData.total_assessments}</p>
              </div>
              <BookOpen className="h-6 w-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Performance Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Class</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={formatClassPerformanceData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="#8884d8" name="Average Score" />
                <Bar dataKey="passRate" fill="#82ca9d" name="Pass Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={formatTrendsData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="average" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                  name="Average Score"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Grade Distribution and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={formatGradeDistribution()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.grade}: ${entry.percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {formatGradeDistribution().map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{subjectData.pass_rate}%</p>
                  <p className="text-sm text-gray-600">Pass Rate</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{((100 - (subjectData.pass_rate || 0))).toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">Fail Rate</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Performance Range</h4>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <p className="text-lg font-bold text-red-600">{subjectData.lowest_score}%</p>
                    <p className="text-xs text-gray-600">Lowest</p>
                  </div>
                  <div className="flex-1 mx-4 h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded"></div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{subjectData.highest_score}%</p>
                    <p className="text-xs text-gray-600">Highest</p>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <p className="text-sm text-gray-600">
                    Range: {((subjectData.highest_score || 0) - (subjectData.lowest_score || 0)).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Performance Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Class Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formatClassPerformanceData().map((classData) => (
              <div 
                key={classData.class}
                className={`p-4 border rounded-lg ${
                  onClassClick ? 'cursor-pointer hover:bg-gray-50' : ''
                } ${
                  classData.average >= subjectData.overall_average ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
                onClick={() => onClassClick && onClassClick(classData.class)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{classData.class}</h4>
                  <div className={`px-2 py-1 rounded text-xs ${
                    classData.average >= subjectData.overall_average 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {classData.average >= subjectData.overall_average ? 'Above Avg' : 'Below Avg'}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average:</span>
                    <span className="font-medium">{classData.average}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pass Rate:</span>
                    <span className="font-medium">{classData.passRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Assessments:</span>
                    <span className="font-medium">{classData.assessments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Success Areas */}
        <Card>
          <CardHeader>
            <CardTitle>Success Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(subjectData.success_areas || []).length > 0 ? (
                (subjectData.success_areas || []).map((area, index) => (
                  <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                    <Award className="h-5 w-5 text-green-500 mr-3" />
                    <p className="text-gray-700">{area}</p>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-gray-500">
                  <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>Working to identify success patterns</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Areas Needing Attention */}
        <Card>
          <CardHeader>
            <CardTitle>Areas Needing Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(subjectData.challenging_topics || []).length > 0 ? (
                (subjectData.challenging_topics || []).map((topic, index) => (
                  <div key={index} className="flex items-center p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                    <p className="text-gray-700">{topic}</p>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-gray-500">
                  <Award className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>All areas performing well!</p>
                </div>
              )}
              
              {subjectData.challenging_topics.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-medium text-yellow-800 mb-2">Recommendations</h5>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Provide additional resources for challenging topics</li>
                    <li>• Implement targeted remedial sessions</li>
                    <li>• Consider alternative teaching methods</li>
                    <li>• Increase practice exercises for difficult concepts</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubjectAnalytics;
