import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface SchoolFormData {
  school_name: string
  principal_name: string
  phone_number: string
  email: string
  school_domain: string
  password: string
}

export default function SchoolRegistration() {
  const [formData, setFormData] = useState<SchoolFormData>({
    school_name: '',
    principal_name: '',
    phone_number: '',
    email: '',
    school_domain: '',
    password: ''
  })
  
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [schools, setSchools] = useState<any[]>([])
  const [loadingSchools, setLoadingSchools] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const resetForm = () => {
    setFormData({
      school_name: '',
      principal_name: '',
      phone_number: '',
      email: '',
      school_domain: '',
      password: ''
    })
  }

  const createSchool = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:8000/api/schools/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('School registered successfully! Redirecting to login...')
        setMessageType('success')
        resetForm()
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setMessage(data.error || 'Failed to create school')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Network error. Please try again.')
      setMessageType('error')
    }

    setLoading(false)

    // Clear message after 5 seconds
    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  const loadSchools = async () => {
    setLoadingSchools(true)

    try {
      const response = await fetch('http://localhost:8000/api/schools/list/')
      const data = await response.json()

      if (response.ok) {
        setSchools(data.schools)
      } else {
        console.error('Failed to load schools')
      }
    } catch (error) {
      console.error('Network error:', error)
    }

    setLoadingSchools(false)
  }

  const viewSchoolDetails = (school: any) => {
    const details = `
School: ${school.school_name}
Email: ${school.email || 'N/A'}
Phone: ${school.phone_number || 'N/A'}
Principal: ${school.principal_name || 'N/A'}
Domain: ${school.school_domain || 'N/A'}
Created: ${new Date(school.created_at).toLocaleDateString()}
    `
    alert(details)
  }

  // Load schools on component mount
  useState(() => {
    loadSchools()
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/parent-register')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
              >
                Parent Register
              </button>
              <button
                onClick={() => navigate('/parent-login')}
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
              >
                Parent Login
              </button>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
            >
              School Login
            </button>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">School Management System</h1>
          <p className="text-xl text-gray-600">Create and manage multiple schools with ease</p>
        </div>

        {/* Add School Form */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Register New School</h2>
            
            <form onSubmit={createSchool} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="school_name" className="block text-sm font-medium text-gray-700 mb-2">
                    School Name *
                  </label>
                  <input 
                    type="text" 
                    id="school_name" 
                    name="school_name"
                    value={formData.school_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Enter school name"
                  />
                </div>
                <div>
                  <label htmlFor="school_domain" className="block text-sm font-medium text-gray-700 mb-2">
                    School Domain (Optional)
                  </label>
                  <input 
                    type="text" 
                    id="school_domain" 
                    name="school_domain"
                    value={formData.school_domain}
                    onChange={handleInputChange}
                    placeholder="e.g., yourschool.edu"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input 
                    type="tel" 
                    id="phone_number" 
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="principal_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Principal/Head Teacher Name *
                </label>
                <input 
                  type="text" 
                  id="principal_name" 
                  name="principal_name"
                  value={formData.principal_name}
                  onChange={handleInputChange}
                  placeholder="Enter principal's full name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Password *
                </label>
                <input 
                  type="password" 
                  id="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters required</p>
              </div>
              
              <div className="flex items-center justify-center space-x-4 pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-medium transition duration-200 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating School...
                    </>
                  ) : (
                    'Create School'
                  )}
                </button>
                
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition duration-200"
                >
                  Reset Form
                </button>
              </div>
            </form>
            
            {/* Success/Error Messages */}
            {message && (
              <div className={`mt-6 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                <p className="font-medium">{message}</p>
              </div>
            )}
          </div>
        </div>

        {/* Schools List */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-semibold text-gray-800">Registered Schools</h2>
              <button 
                onClick={loadSchools}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
            
            {loadingSchools && (
              <div className="text-center py-12">
                <svg className="animate-spin mx-auto h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-500 mt-4">Loading schools...</p>
              </div>
            )}
            
            {!loadingSchools && schools.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-gray-500 text-lg mt-4">No schools found. Create your first school above!</p>
              </div>
            )}
            
            {!loadingSchools && schools.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schools.map((school) => (
                  <div key={school.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition duration-200 bg-gradient-to-br from-white to-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">{school.school_name}</h3>
                      <span 
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          school.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {school.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      {school.email && (
                        <p><strong>Email:</strong> {school.email}</p>
                      )}
                      {school.phone_number && (
                        <p><strong>Phone:</strong> {school.phone_number}</p>
                      )}
                      {school.principal_name && (
                        <p><strong>Principal:</strong> {school.principal_name}</p>
                      )}
                      {school.school_domain && (
                        <p>
                          <strong>Domain:</strong> 
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1 ml-1">
                            {school.school_domain}
                          </span>
                        </p>
                      )}
                    </div>
                    
                    <div className="flex justify-center">
                      <button 
                        onClick={() => viewSchoolDetails(school)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
