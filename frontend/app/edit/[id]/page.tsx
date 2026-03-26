"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function EditRequest({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    code: "",
    date: "",
    status: "",
    department: "",
    requester_name: "",
    notes: "",
  });

  const [departments, setDepartments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [uoms, setUoms] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        setFetching(true);
        const [meta, requestRes] = await Promise.all([
          Promise.all([
            fetch("http://localhost:3001/departments").then(r => r.json()),
            fetch("http://localhost:3001/users").then(r => r.json()),
            fetch("http://localhost:3001/suppliers").then(r => r.json()),
            fetch("http://localhost:3001/materials").then(r => r.json()),
            fetch("http://localhost:3001/uom").then(r => r.json())
          ]),
          fetch(`http://localhost:3001/request-material/${id}`)
        ]);

        const [deps, usrs, sups, mats, ums] = meta;
        if (Array.isArray(deps)) setDepartments(deps);
        if (Array.isArray(usrs)) setUsers(usrs);
        if (Array.isArray(sups)) setSuppliers(sups);
        if (Array.isArray(mats)) setMaterials(mats);
        if (Array.isArray(ums)) setUoms(ums);

        if (requestRes.ok) {
          const data = await requestRes.json();
          setFormData({
            code: data.code || "",
            date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
            status: data.status || "PENDING",
            department: data.department || "",
            requester_name: data.requester_name || "",
            notes: data.notes || "",
          });
          setItems(data.material_details && data.material_details.length > 0 ? data.material_details : [
            { material_description: "", material_type: "", quantity: 1, unit_of_measure: "", estimated_cost: 0, currency: "USD", supplier_preference: "", notes: "" }
          ]);
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setFetching(false);
      }
    };
    init();
  }, [id]);

  const handleAddItem = () => {
    setItems([...items, { material_description: "", material_type: "", quantity: 1, unit_of_measure: "", estimated_cost: 0, currency: "USD", supplier_preference: "", notes: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      material_details: items.map(item => ({
        id: item.id,
        material_description: item.material_description,
        material_type: item.material_type,
        quantity: Number(item.quantity),
        unit_of_measure: item.unit_of_measure,
        estimated_cost: Number(item.estimated_cost),
        currency: item.currency,
        supplier_preference: item.supplier_preference,
        notes: item.notes,
      }))
    };

    try {
      const res = await fetch(`http://localhost:3001/request-material/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/");
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Request</h1>
            <p className="text-gray-500 mt-1">Modify material request {formData.code}</p>
          </div>
        </div>
        <div>
          <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 font-medium focus:outline-none focus:border-indigo-500">
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* General Info Section */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
            General Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Request Code *</label>
              <input required type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Date *</label>
              <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all " />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Department</label>
              <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none">
                <option value="">Select Department...</option>
                {departments.map((d: any) => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Requester Name</label>
              <select value={formData.requester_name} onChange={e => setFormData({ ...formData, requester_name: e.target.value })} className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none">
                <option value="">Select Requester...</option>
                {users.map((u: any) => <option key={u.id} value={u.name}>{u.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Notes / Purpose</label>
              <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all h-24 resize-none" />
            </div>
          </div>
        </div>

        {/* Material Items Section */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
              Material Details
            </h2>
            <button type="button" onClick={handleAddItem} className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-300 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {items.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 relative group">
                {items.length > 1 && (
                  <button type="button" onClick={() => handleRemoveItem(index)} className="absolute -top-3 -right-3 p-1.5 bg-rose-500 text-gray-900 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600 hover:scale-110">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">Description *</label>
                    <select required value={item.material_description} onChange={e => {
                      const selectedMat = materials.find((m: any) => m.description === e.target.value);
                      handleItemChange(index, 'material_description', e.target.value);
                      if (selectedMat) {
                        handleItemChange(index, 'material_type', selectedMat.material_type);
                        handleItemChange(index, 'unit_of_measure', selectedMat.default_uom);
                      }
                    }} className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none">
                      <option value="">Select Material...</option>
                      {materials.map((m: any) => <option key={m.id} value={m.description}>{m.description}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">Type *</label>
                    <input required type="text" value={item.material_type} onChange={e => handleItemChange(index, 'material_type', e.target.value)} className="bg-gray-50/50 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">Supplier Pref</label>
                    <select value={item.supplier_preference || ''} onChange={e => handleItemChange(index, 'supplier_preference', e.target.value)} className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none">
                      <option value="">Select Supplier...</option>
                      {suppliers.map((s: any) => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">Quantity *</label>
                    <input required type="number" min="1" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">Unit (UOM) *</label>
                    <select required value={item.unit_of_measure} onChange={e => handleItemChange(index, 'unit_of_measure', e.target.value)} className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none">
                      <option value="">Select UOM...</option>
                      {uoms.map((u: any) => <option key={u.id} value={u.code}>{u.code}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">Est. Cost</label>
                    <input type="number" min="0" step="0.01" value={item.estimated_cost} onChange={e => handleItemChange(index, 'estimated_cost', e.target.value)} className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">Currency</label>
                    <input type="text" value={item.currency} onChange={e => handleItemChange(index, 'currency', e.target.value)} className="bg-gray-50/50 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link href="/" className="px-5 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            Cancel
          </Link>
          <button disabled={loading} type="submit" className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-70 disabled:hover:bg-indigo-500 text-gray-900 px-6 py-2.5 rounded-lg transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] font-medium">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
