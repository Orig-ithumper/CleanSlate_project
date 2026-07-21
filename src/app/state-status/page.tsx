'use client';
import { useState } from 'react';

// Simple mock state data (replace / expand as needed)
const stateData = [
  { name: 'California', status: 'Active', fee: 120, waiver: true },
  { name: 'Pennsylvania', status: 'Active', fee: 0, waiver: false },
  { name: 'Texas', status: 'Manual / Petition Only', fee: 100, waiver: false },
  { name: 'Michigan', status: 'Active', fee: 0, waiver: false },
  { name: 'Florida', status: 'Manual / Petition Only', fee: 100, waiver: false },
  { name: 'Utah', status: 'Active', fee: 0, waiver: false },
  { name: 'Oregon', status: 'In Progress', fee: 75, waiver: true },
  { name: 'New York', status: 'In Progress', fee: 95, waiver: false },
];

export default function StateStatusPage() {
  const [filter, setFilter] = useState('All');

  const filteredStates =
    filter === 'All'
      ? stateData
      : stateData.filter((s) => s.status === filter);

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-700 dark:text-indigo-400 tracking-tight">
  State Expungement Status & Fees
</h1>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-3 mb-6">
          {['All', 'Active', 'In Progress', 'Manual / Petition Only'].map((label) => (
            <button
              key={label}
              onClick={() => setFilter(label)}
              className={`px-4 py-2 rounded-md text-sm font-medium border 
                ${
                  filter === label
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* State Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-gray-200">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="py-2 px-4 border-b">State</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Court Fee ($)</th>
                <th className="py-2 px-4 border-b">Waiver Available</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {filteredStates.map((st) => (
                <tr key={st.name} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{st.name}</td>
                  <td
                    className={`py-2 px-4 border-b font-medium ${
                      st.status === 'Active'
                        ? 'text-green-600'
                        : st.status === 'In Progress'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {st.status}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {st.fee === 0 ? 'None' : `$${st.fee}`}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {st.waiver ? 'Yes' : 'No'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          * Data are indicative — confirm your local court for final filing fees and eligibility.
        </p>
      </div>
    </main>
  );
}
