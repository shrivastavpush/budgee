import React from 'react'

// Optional inclusive date range for exports; empty means "all time".
const ExportRange = ({ from, to, onChange }) => (
  <div className="flex items-center gap-2 text-xs text-gray-500">
    <label className="flex items-center gap-1">
      From
      <input
        type="date"
        value={from}
        max={to || undefined}
        onChange={(e) => onChange({ from: e.target.value, to })}
        className="rounded-md border border-gray-200 bg-transparent px-1.5 py-1"
      />
    </label>
    <label className="flex items-center gap-1">
      To
      <input
        type="date"
        value={to}
        min={from || undefined}
        onChange={(e) => onChange({ from, to: e.target.value })}
        className="rounded-md border border-gray-200 bg-transparent px-1.5 py-1"
      />
    </label>
  </div>
)

export default ExportRange
