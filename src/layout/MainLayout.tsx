import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'

export default function MainLayout() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<div className="h-screen overflow-hidden bg-gray-50 text-gray-900 flex">
			{/* Sidebar (fixed height, does not scroll with page content) */}
			<Sidebar />

			{/* Main content column: header + scrollable content */}
			<div className="flex-1 min-w-0 flex flex-col">
				{/* Top bar */}
				<header className="bg-white border-b border-gray-200 shrink-0">
					<div className="px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
						<h1 className="text-lg font-semibold">School Result Manager</h1>
						<div className="flex items-center space-x-4">
							<span className="text-sm text-gray-600">
								{user?.school_name} • {user?.email}
							</span>
							<button
								onClick={handleLogout}
								className="text-sm text-red-600 hover:text-red-800 font-medium"
							>
								Logout
							</button>
						</div>
					</div>
				</header>

				<main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
					<Outlet />
				</main>
			</div>
		</div>
	)
}

