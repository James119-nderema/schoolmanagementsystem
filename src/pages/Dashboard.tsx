"use client"

import Dashboard, { type DashboardFilters } from '../components/dashboard/Dashboard'
import { useSearchParams } from 'react-router-dom'

export default function DashboardPage() {
	const [params] = useSearchParams()
	const filters: DashboardFilters = {
		classId: params.get('classId'),
		term: params.get('term'),
	}
	return <Dashboard filters={filters} />
}

