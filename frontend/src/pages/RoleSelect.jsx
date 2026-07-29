import { useNavigate } from 'react-router-dom'

// Landing screen: ask which role the user wants to sign in as,
// then send them to the respective login page.
export default function RoleSelect() {
  const navigate = useNavigate()

  const roles = [
    {
      key: 'admin',
      title: 'Admin',
      desc: 'Full access and management',
      accent: 'from-indigo-500 to-indigo-700',
      icon: 'M12 4.5v15m7.5-7.5h-15',
    },
    {
      key: 'viewer',
      title: 'Viewer',
      desc: 'Read-only access',
      accent: 'from-emerald-500 to-emerald-700',
      icon: 'M2.036 12.322a1 1 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome</h1>
        <p className="text-slate-500 mb-8">Choose how you want to sign in</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {roles.map((r) => (
            <button
              key={r.key}
              onClick={() => navigate(`/login/${r.key}`)}
              className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-left hover:shadow-md hover:border-indigo-300 transition"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.accent} flex items-center justify-center mb-4`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={r.icon} />
                </svg>
              </div>
              <p className="text-lg font-semibold text-slate-900">{r.title}</p>
              <p className="text-sm text-slate-500 mt-1">{r.desc}</p>
              <span className="inline-block mt-4 text-sm font-medium text-indigo-600 group-hover:underline">
                Continue as {r.title} →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
