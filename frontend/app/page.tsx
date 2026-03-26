"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, FileText, Calendar, Box, Activity } from "lucide-react";
import Link from "next/link";

interface MaterialDetailItem {
  id: string;
  material_description: string;
  quantity: number;
}

interface RequestData {
  id: string;
  code: string;
  date: string;
  status: string;
  department: string;
  requester_name: string;
  material_details: MaterialDetailItem[];
}

export default function Home() {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRequests(statusFilter, searchQuery);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [statusFilter, searchQuery]);

  const fetchRequests = async (status: string, search: string) => {
    setLoading(true);
    let url = "http://localhost:3001/request-material?";
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (search) params.append("search", search);
    url += params.toString();
    try {
      const res = await fetch(url);
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this specific request?")) return;
    try {
      await fetch(`http://localhost:3001/request-material/${id}`, { method: "DELETE" });
      fetchRequests(statusFilter, searchQuery);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "APPROVED":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "REJECTED":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-gray-500 border-slate-500/20";
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Requests Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg flex items-center px-3 py-2 w-full md:w-64">
            <Search className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          <div className="relative bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg flex items-center px-3 py-2 w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full appearance-none"
            >
              <option value="" className="bg-gray-100">All Statuses</option>
              <option value="PENDING" className="bg-gray-100">Pending</option>
              <option value="APPROVED" className="bg-gray-100">Approved</option>
              <option value="REJECTED" className="bg-gray-100">Rejected</option>
            </select>
          </div>
          <Link
            href="/create"
            className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-gray-900 px-4 py-2.5 rounded-lg transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] font-medium text-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New Request
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 overflow-hidden rounded-xl border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <FileText className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg">No material requests found.</p>
            <p className="text-sm opacity-60">Create a new request to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium tracking-wider">Request Code</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Department</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Date</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Items</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Status</th>
                  <th className="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-white transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold">{req.code}</p>
                          <p className="text-xs text-slate-500">{req.requester_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Activity className="w-4 h-4 text-slate-500" />
                        {req.department || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {new Date(req.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Box className="w-4 h-4 text-slate-500" />
                        {req.material_details?.length || 0} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/edit/${req.id}`}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-400/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(req.id)}
                          className="p-2 text-gray-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
