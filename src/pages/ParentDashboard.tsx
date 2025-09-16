import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

interface StudentPerformance {
  student_id: number;
  student_name: string;
  class_name: string;
  stream: string;
  overall_average: number;
  total_marks: number;
  possible_marks: number;
  class_rank: number;
  stream_rank: number;
  subjects: Array<{
    subject_name: string;
    marks_obtained: number;
    total_marks: number;
    percentage: number;
    grade: string;
    class_average: number;
    stream_average: number;
  }>;
  performance_trend: Array<{
    exam_date: string;
    average_percentage: number;
    class_average: number;
  }>;
  comparison: {
    class_average: number;
    stream_average: number;
    school_average: number;
  };
  strengths: string[];
  areas_for_improvement: string[];
  recommendations: string[];
  attendance: {
    total_days: number;
    present_days: number;
    percentage: number;
  };
}

interface Child {
  id: number;
  name: string;
  class_name: string;
  stream: string;
}

const ParentDashboard: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentPerformance | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChildId) {
      fetchStudentData();
    }
  }, [selectedChildId]);

  const fetchChildren = async () => {
    try {
      const token = localStorage.getItem('parent_access_token');
      const response = await fetch('/api/parents/children/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setChildren(data.results || data);
        // Auto-select first child if only one
        if ((data.results || data).length === 1) {
          setSelectedChildId((data.results || data)[0].id.toString());
        }
      }
    } catch (err) {
      console.error('Error fetching children:', err);
    }
  };

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('parent_access_token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch(`/api/statistics/parent_dashboard/?student_id=${selectedChildId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Access denied. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You are not authorized to view this student\'s data.');
        }
        throw new Error(`Failed to fetch student data: ${response.status}`);
      }

      const data = await response.json();
      setStudentData(data);
    } catch (err) {
      console.error('Error fetching student data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  const getGradeColor = (grade: string) => {
    switch (grade.toUpperCase()) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'D': return 'text-orange-600 bg-orange-100';
      case 'F': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 85) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 65) return 'text-yellow-600';
    if (percentage >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Child's Performance</h1>
        
        {/* Child Selection */}
        {children.length > 1 && (
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Child:
            </label>
            <select
              value={selectedChildId}
              onChange={(e) => {
                setSelectedChildId(e.target.value);
                setStudentData(null);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose your child...</option>
              {children.map(child => (
                <option key={child.id} value={child.id.toString()}>
                  {child.name} - {child.class_name} ({child.stream})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={fetchStudentData}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* Student Data Display */}
      {studentData && !loading && (
        <>
          {/* Student Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{studentData.student_name}</h2>
                <p className="text-gray-600">{studentData.class_name} - {studentData.stream} Stream</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`text-2xl font-bold ${getPerformanceColor(studentData.overall_average)}`}>
                  {studentData.overall_average.toFixed(1)}%
                </span>
                <p className="text-sm text-gray-500">Overall Average</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h4 className="text-sm font-medium text-blue-600">Class Rank</h4>
                <p className="text-2xl font-bold text-blue-900">#{studentData.class_rank}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h4 className="text-sm font-medium text-green-600">Stream Rank</h4>
                <p className="text-2xl font-bold text-green-900">#{studentData.stream_rank}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <h4 className="text-sm font-medium text-purple-600">Total Marks</h4>
                <p className="text-xl font-bold text-purple-900">{studentData.total_marks}/{studentData.possible_marks}</p>
              </div>
              {studentData.attendance && (
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <h4 className="text-sm font-medium text-orange-600">Attendance</h4>
                  <p className="text-2xl font-bold text-orange-900">{studentData.attendance.percentage.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">{studentData.attendance.present_days}/{studentData.attendance.total_days} days</p>
                </div>
              )}
            </div>
          </div>

          {/* Performance Comparison */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <h4 className="text-sm font-medium text-gray-600 mb-2">vs Class Average</h4>
                <div className="text-2xl font-bold text-blue-600 mb-1">{studentData.comparison.class_average.toFixed(1)}%</div>
                <div className={`text-sm font-medium ${studentData.overall_average > studentData.comparison.class_average ? 'text-green-600' : 'text-red-600'}`}>
                  {studentData.overall_average > studentData.comparison.class_average ? '+' : ''}
                  {(studentData.overall_average - studentData.comparison.class_average).toFixed(1)}% 
                  {studentData.overall_average > studentData.comparison.class_average ? ' above' : ' below'}
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="text-sm font-medium text-gray-600 mb-2">vs Stream Average</h4>
                <div className="text-2xl font-bold text-green-600 mb-1">{studentData.comparison.stream_average.toFixed(1)}%</div>
                <div className={`text-sm font-medium ${studentData.overall_average > studentData.comparison.stream_average ? 'text-green-600' : 'text-red-600'}`}>
                  {studentData.overall_average > studentData.comparison.stream_average ? '+' : ''}
                  {(studentData.overall_average - studentData.comparison.stream_average).toFixed(1)}% 
                  {studentData.overall_average > studentData.comparison.stream_average ? ' above' : ' below'}
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="text-sm font-medium text-gray-600 mb-2">vs School Average</h4>
                <div className="text-2xl font-bold text-purple-600 mb-1">{studentData.comparison.school_average.toFixed(1)}%</div>
                <div className={`text-sm font-medium ${studentData.overall_average > studentData.comparison.school_average ? 'text-green-600' : 'text-red-600'}`}>
                  {studentData.overall_average > studentData.comparison.school_average ? '+' : ''}
                  {(studentData.overall_average - studentData.comparison.school_average).toFixed(1)}% 
                  {studentData.overall_average > studentData.comparison.school_average ? ' above' : ' below'}
                </div>
              </div>
            </div>
          </div>

          {/* Subject Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={studentData.subjects}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject_name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="percentage" fill="#8884d8" name="Your Score" />
                  <Bar dataKey="class_average" fill="#82ca9d" name="Class Average" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Grade Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(
                      studentData.subjects.reduce((acc, subject) => {
                        acc[subject.grade] = (acc[subject.grade] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([grade, count]) => ({ grade, count }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.grade}: ${entry.count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {Object.entries(
                      studentData.subjects.reduce((acc, subject) => {
                        acc[subject.grade] = (acc[subject.grade] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Trend */}
          {studentData.performance_trend.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Trend Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={studentData.performance_trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="exam_date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="average_percentage" stroke="#8884d8" strokeWidth={2} name="Your Performance" />
                  <Line type="monotone" dataKey="class_average" stroke="#82ca9d" strokeWidth={2} name="Class Average" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Strengths, Weaknesses, and Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-green-700 mb-4">Strengths</h3>
              <ul className="space-y-2">
                {studentData.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-orange-700 mb-4">Areas for Improvement</h3>
              <ul className="space-y-2">
                {studentData.areas_for_improvement.map((area, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-orange-500 mr-2">⚠</span>
                    <span className="text-gray-700">{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {studentData.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">💡</span>
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detailed Subject Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Subject Performance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Your %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class Avg
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentData.subjects.map((subject, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {subject.subject_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subject.marks_obtained}/{subject.total_marks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-medium ${getPerformanceColor(subject.percentage)}`}>
                          {subject.percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subject.class_average.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(subject.grade)}`}>
                          {subject.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* No Child Selected Message */}
      {!selectedChildId && !loading && children.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-600 mb-2">Select Your Child</h3>
          <p className="text-gray-500">Choose your child from the dropdown menu above to view their performance data.</p>
        </div>
      )}

      {/* No Children Found */}
      {children.length === 0 && !loading && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Children Found</h3>
          <p className="text-gray-500">No student records are linked to your account. Please contact the school administrator.</p>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
