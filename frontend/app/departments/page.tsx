"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Building2, Edit2, X } from "lucide-react";

export default function DepartmentPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ "code": "", "name": "" });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/departments`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editId ? `http://localhost:3001/departments/${editId}` : `http://localhost:3001/departments`;
      const method = editId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ "code": "", "name": "" });
        setEditId(null);
        fetchData();
      } else {
        const error = await res.json();
        alert('Error: ' + JSON.stringify(error.message || error));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      const res = await fetch(`http://localhost:3001/departments/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
          <Building2 className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Departments</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Panel */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 p-5 rounded-xl border border-gray-200 h-fit sticky top-24">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{editId ? "Edit Department" : "Add New Department"}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-700 uppercase tracking-wider">Code</label>
              <input
                required
                type="text"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-700 uppercase tracking-wider">Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            {editId && (
              <button
                type="button"
                onClick={() => { setEditId(null); setFormData({ "code": "", "name": "" }); }}
                className="mt-2 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 w-full py-2.5 rounded-lg transition-colors font-medium text-sm"
              >
                <X className="w-4 h-4" /> Cancel Edit
              </button>
            )}
            <button
              disabled={saving}
              type="submit"
              className="mt-2 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-70 text-gray-900 w-full py-2.5 rounded-lg transition-colors font-medium text-sm"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (editId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
              {editId ? "Update Department" : "Add Department"}
            </button>
          </form>
        </div>

        {/* Data Table Panel */}
        <div className="lg:col-span-2 bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Code</th><th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex justify-center mb-2"><div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div></div>
                      Loading data...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      No departments found.
                    </td>
                  </tr>
                ) : (
                  data.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-gray-50 hover:bg-gray-100 transition-colors">
                      <td className="px-6 py-4 text-gray-700">{item.code}</td><td className="px-6 py-4 text-gray-700">{item.name}</td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditId(item.id);
                            setFormData({ code: item.code, name: item.name });
                          }}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}