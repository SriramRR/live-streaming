import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

// Labelled input with an optional leading icon, inline error, and a
// built-in show/hide toggle for password fields.
export default function Field({ label, error, icon: Icon, type = 'text', hint, ...props }) {
  const [reveal, setReveal] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && reveal ? 'text' : type

  return (
    <div>
      {label && (
        <label className="block text-[11px] font-semibold tracking-wide uppercase text-slate-500 mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            strokeWidth={2}
          />
        )}

        <input
          {...props}
          type={inputType}
          className={`w-full py-2.5 rounded-lg text-sm text-slate-900 placeholder:text-slate-400
            bg-white border outline-none transition
            ${Icon ? 'pl-10' : 'pl-3.5'} ${isPassword ? 'pr-10' : 'pr-3.5'}
            ${error
              ? 'border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
              : 'border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100'}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((v) => !v)}
            tabIndex={-1}
            aria-label={reveal ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
          >
            {reveal ? <EyeOff className="w-4 h-4" strokeWidth={2} /> : <Eye className="w-4 h-4" strokeWidth={2} />}
          </button>
        )}
      </div>

      {error ? (
        <p className="mt-1.5 text-[12px] text-rose-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[12px] text-slate-400">{hint}</p>
      ) : null}
    </div>
  )
}
