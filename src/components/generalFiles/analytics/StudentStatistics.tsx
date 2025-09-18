import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line,ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { authFetch } from '../../../utils/apiInterceptors';

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
  }>;
  performance_trend: Array<{
    exam_date: string;
    average_percentage: number;
  }>;
  comparison: {
    class_average: number;
    stream_average: number;
    school_average: number;
  };
}

interface Class {
  id: number;
  class_name: string;
  class_code: string;
  stream: string;
  grade_level: string;
}

interface Student {
  id: number;
  full_name: string;
  admission_number: string;
  current_class: string;
}

const StudentStatistics: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [studentData, setStudentData] = useState<StudentPerformance | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>(searchParams.get('class_id') || '');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(searchParams.get('student_id') || '');
  const [selectedTerm, setSelectedTerm] = useState<string>('1');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('2024-2025');
  const [selectedExamType, setSelectedExamType] = useState<string>('exam_1');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [noDataResponse, setNoDataResponse] = useState<any>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchStudentsByClass(selectedClassId);
    }
  }, [selectedClassId]);

  useEffect(() => {
    if (selectedStudentId && selectedClassId) {
      fetchStudentStatistics();
    }
  }, [selectedStudentId, selectedClassId, selectedTerm, selectedAcademicYear, selectedExamType]);

  const fetchClasses = async () => {
    try {
      const response = await authFetch('/api/classes/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setClasses(data.results || data);
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  const fetchStudentsByClass = async (classId: string) => {
    try {
      const response = await authFetch(`/api/input-marks/class-students/${classId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchStudentStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      setNoDataResponse(null);

      // Validate required parameters
      if (!selectedStudentId || !selectedClassId) {
        setError('Please select both a class and a student to view statistics');
        setLoading(false);
        return;
      }

      const queryParams = new URLSearchParams({
        student_id: selectedStudentId,
        class_id: selectedClassId,
        term: selectedTerm,
        academic_year: selectedAcademicYear,
        exam_type: selectedExamType
      });

      console.log('Making request to:', `/api/input-marks/student-analytics/?${queryParams}`);

      const response = await authFetch(`/api/input-marks/student-analytics/?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.available_combinations && errorData.available_combinations.length > 0) {
          const combinations = errorData.available_combinations.map((combo: any) => 
            `Term ${combo.term}, ${combo.academic_year}, ${combo.exam_type.replace('_', ' ')}`
          ).join('; ');
          setError(`${errorData.message || errorData.error} Available combinations: ${combinations}`);
        } else {
          setError(errorData.message || errorData.error || `HTTP ${response.status}`);
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      
      // Check if it's a "no data" response
      if (data.no_data) {
        setStudentData(null);
        setError(null);
        setNoDataResponse(data);
        setLoading(false);
        return;
      }
      
      // Check if it's an error response
      if (data.error) {
        setError(data.message || data.error);
        setStudentData(null);
        setNoDataResponse(null);
        setLoading(false);
        return;
      }
      
      setStudentData(data);
      setError(null);
      setNoDataResponse(null);
    } catch (err) {
      console.error('Error fetching student statistics:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setStudentData(null);
      setNoDataResponse(null);
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

  return (
    <div className="p-6 space-y-6">
      {/* Header and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Student Statistics</h1>
        
        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class:
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => {
                const classId = e.target.value;
                setSelectedClassId(classId);
                setSelectedStudentId(''); // Reset student selection
                setStudentData(null);
                
                // Update URL parameters
                const newParams = new URLSearchParams(searchParams);
                if (classId) {
                  newParams.set('class_id', classId);
                } else {
                  newParams.delete('class_id');
                }
                newParams.delete('student_id'); // Remove student_id when class changes
                setSearchParams(newParams);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a class...</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id.toString()}>
                  {cls.class_name} - Stream {cls.stream}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Student:
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                const studentId = e.target.value;
                setSelectedStudentId(studentId);
                
                // Update URL parameters
                const newParams = new URLSearchParams(searchParams);
                if (studentId) {
                  newParams.set('student_id', studentId);
                } else {
                  newParams.delete('student_id');
                }
                setSearchParams(newParams);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedClassId}
            >
              <option value="">Choose a student...</option>
              {students.map(student => (
                <option key={student.id} value={student.id.toString()}>
                  {student.full_name} ({student.admission_number})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Term:
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Term 1</option>
              <option value="2">Term 2</option>
              <option value="3">Term 3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year:
            </label>
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2024-2025">2024-2025</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2025-2026">2025-2026</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exam Type:
            </label>
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="exam_1">Exam 1</option>
              <option value="exam_2">Exam 2</option>
              <option value="exam_3">Exam 3</option>
            </select>
          </div>
        </div>
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
            onClick={fetchStudentStatistics}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* No Data Available Message */}
      {noDataResponse && !loading && !error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg text-center">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <strong className="text-lg font-semibold">No Data Available</strong>
          </div>
          <p className="text-sm mb-2">{noDataResponse.message}</p>
          <div className="bg-yellow-100 rounded p-3 mt-3">
            <p className="text-sm font-medium mb-1">Query Details:</p>
            <p className="text-sm">
              <strong>Student:</strong> {noDataResponse.student_name} | 
              <strong> Class:</strong> {noDataResponse.class_name}
            </p>
            <p className="text-sm">
              <strong>Period:</strong> {noDataResponse.period_info?.term}, {noDataResponse.period_info?.academic_year}, {noDataResponse.period_info?.exam_type}
            </p>
          </div>
          <p className="text-xs mt-3 text-yellow-700">
            Try selecting a different term, academic year, or exam type to find available data.
          </p>
        </div>
      )}

      {/* No Selection Message */}
      {!studentData && !loading && !error && !noDataResponse && (!selectedClassId || !selectedStudentId) && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-center">
          <strong className="font-bold">Select a class and student</strong>
          <p className="text-sm mt-1">Choose both a class and a student from the dropdowns above to view detailed statistics.</p>
        </div>
      )}

      {/* Student Statistics Display */}
      {studentData && !loading && (
        <>
          {/* Student Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800">{studentData.student_name}</h3>
                <p className="text-sm text-gray-600">{studentData.class_name} ({studentData.stream})</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h4 className="text-sm font-medium text-blue-600">Overall Average</h4>
                <p className="text-2xl font-bold text-blue-900">{studentData.overall_average?.toFixed(1) ?? 'N/A'}%</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h4 className="text-sm font-medium text-green-600">Class Rank</h4>
                <p className="text-2xl font-bold text-green-900">#{studentData.class_rank}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <h4 className="text-sm font-medium text-purple-600">Stream Rank</h4>
                <p className="text-2xl font-bold text-purple-900">#{studentData.stream_rank}</p>
              </div>
            </div>
          </div>

          {/* Subject Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Subject Performance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={studentData.subjects || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject_name" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Grade Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(
                      (studentData.subjects || []).reduce((acc, subject) => {
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
                      (studentData.subjects || []).reduce((acc, subject) => {
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

          {/* Performance Comparison */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance Comparison</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">Class Average</h3>
                <p className="text-xl font-bold text-blue-600">
                  {studentData.comparison?.class_average?.toFixed(1) ?? 'N/A'}%
                </p>
                {studentData.comparison?.class_average !== undefined && (
                  <p className={`text-sm ${studentData.overall_average > studentData.comparison.class_average ? 'text-green-600' : 'text-red-600'}`}>
                    {studentData.overall_average > studentData.comparison.class_average ? '+' : ''}
                    {(studentData.overall_average - studentData.comparison.class_average).toFixed(1)}%
                  </p>
                )}
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">Stream Average</h3>
                <p className="text-xl font-bold text-green-600">
                  {studentData.comparison?.stream_average?.toFixed(1) ?? 'N/A'}%
                </p>
                {studentData.comparison?.stream_average !== undefined && (
                  <p className={`text-sm ${studentData.overall_average > studentData.comparison.stream_average ? 'text-green-600' : 'text-red-600'}`}>
                    {studentData.overall_average > studentData.comparison.stream_average ? '+' : ''}
                    {(studentData.overall_average - studentData.comparison.stream_average).toFixed(1)}%
                  </p>
                )}
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">School Average</h3>
                <p className="text-xl font-bold text-purple-600">
                  {studentData.comparison?.school_average?.toFixed(1) ?? 'N/A'}%
                </p>
                {studentData.comparison?.school_average !== undefined && (
                  <p className={`text-sm ${studentData.overall_average > studentData.comparison.school_average ? 'text-green-600' : 'text-red-600'}`}>
                    {studentData.overall_average > studentData.comparison.school_average ? '+' : ''}
                    {(studentData.overall_average - studentData.comparison.school_average).toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Performance Trend */}
          {(studentData.performance_trend || []).length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={studentData.performance_trend || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="exam_date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="average_percentage" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Subject Details Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Detailed Subject Performance</h2>
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
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(studentData.subjects || []).map((subject, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {subject.subject_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subject.marks_obtained}/{subject.total_marks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subject.percentage?.toFixed(1) ?? 'N/A'}%
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

      {/* No Student Selected Message */}
      {!selectedStudentId && !loading && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-600 mb-2">Select a Student</h3>
          <p className="text-gray-500">Choose a class and student from the dropdown menus above to view detailed statistics.</p>
        </div>
      )}
    </div>
  );
};

export default StudentStatistics;
