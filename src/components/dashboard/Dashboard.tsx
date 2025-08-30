export type DashboardFilters = {
  classId?: string | null
  term?: string | null
}

type StudentSummary = {
  id: string
  name: string
  class: string
  average: number
  position: number
}

const dummyStats = {
  totalStudents: 420,
  totalSubjects: 12,
  term: '2024/2025 - Term 3',
  publishedResults: 386,
}

const allTopStudents: StudentSummary[] = [
  { id: 'STU001', name: 'Damie Johnson', class: 'SS2A', average: 92.3, position: 1 },
  { id: 'STU102', name: 'Ada Obi', class: 'SS2B', average: 89.7, position: 2 },
  { id: 'STU043', name: 'Kunle Ade', class: 'SS2A', average: 88.5, position: 3 },
  { id: 'STU210', name: 'Chioma Okafor', class: 'SS2C', average: 87.1, position: 4 },
  { id: 'STU318', name: 'Ifeanyi Uche', class: 'SS2A', average: 85.6, position: 5 },
]

export default function Dashboard({ filters }: { filters?: DashboardFilters }) {
  const filtered = allTopStudents.filter((s) =>
    filters?.classId ? s.class.toLowerCase() === String(filters.classId).toLowerCase() : true
  )

  return (
    <div className="space-y-6">
      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Students" value={dummyStats.totalStudents} color="bg-blue-50 text-blue-700" />
        <StatCard label="Subjects" value={dummyStats.totalSubjects} color="bg-emerald-50 text-emerald-700" />
        <StatCard label="Term" value={filters?.term ?? dummyStats.term} color="bg-violet-50 text-violet-700" />
        <StatCard label="Published Results" value={dummyStats.publishedResults} color="bg-amber-50 text-amber-700" />
      </section>

      {/* Charts placeholder */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-2">Average Score Trend</h3>
          <div className="h-48 grid place-items-center text-gray-400">Chart goes here</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-2">Pass Rate</h3>
          <div className="h-48 grid place-items-center text-gray-400">Donut chart here</div>
        </div>
      </section>

      {/* Top Students */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Top Students{filters?.classId ? ` - ${filters.classId}` : ''}</h3>
          <span className="text-xs text-gray-500">Latest term</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3 font-medium">Position</th>
                <th className="text-left p-3 font-medium">Student</th>
                <th className="text-left p-3 font-medium">Class</th>
                <th className="text-right p-3 font-medium">Average</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t border-gray-100">
                  <td className="p-3">#{s.position}</td>
                  <td className="p-3">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-gray-500 text-xs">{s.id}</div>
                  </td>
                  <td className="p-3">{s.class}</td>
                  <td className="p-3 text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700">
                      {s.average.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-4`}>
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`mt-2 inline-flex items-center rounded-md px-2.5 py-1 text-sm font-semibold ${color}`}>
        {value}
      </div>
    </div>
  )
}
