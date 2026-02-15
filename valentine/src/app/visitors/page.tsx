"use client";

import { useState } from "react";
import { getVisitorNames } from "../actions";

interface VisitorEntry {
  name: string;
  timestamp: string;
  date: string;
  time: string;
}

export default function VisitorsPage() {
  const [code, setCode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [visitors, setVisitors] = useState<VisitorEntry[]>([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const result = await getVisitorNames(code);
    
    if (result.success) {
      setAuthenticated(true);
      setVisitors(result.data);
    } else {
      setError("Invalid access code");
      setCode("");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            🔐 Visitor Log
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter access code"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 text-center text-lg"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
            >
              Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              💕 Visitor Log
            </h1>
            <button
              onClick={() => setAuthenticated(false)}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
            >
              Lock
            </button>
          </div>

          <div className="mb-6 p-4 bg-pink-500/20 rounded-lg border border-pink-500/30">
            <p className="text-pink-200 text-center">
              <strong>Total Visitors:</strong> {visitors.length}
            </p>
          </div>

          {visitors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">No visitors yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="px-4 py-3 text-left text-pink-300 font-semibold">#</th>
                    <th className="px-4 py-3 text-left text-pink-300 font-semibold">Name</th>
                    <th className="px-4 py-3 text-left text-pink-300 font-semibold">Date</th>
                    <th className="px-4 py-3 text-left text-pink-300 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((visitor, index) => (
                    <tr
                      key={index}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-white/80">{index + 1}</td>
                      <td className="px-4 py-3 text-white font-medium">{visitor.name}</td>
                      <td className="px-4 py-3 text-white/80">{visitor.date}</td>
                      <td className="px-4 py-3 text-white/80">{visitor.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
