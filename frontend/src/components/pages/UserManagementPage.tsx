import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, Search, CheckCircle2, User, Mail, Lock, X } from 'lucide-react';
import type { SystemUser, UserRole } from '../../types/auth';
import axios from 'axios';
import { PaginationBar } from '../PaginationBar';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>([
    { id: 1, username: 'super_admin', name: 'Director Robert Chen', email: 'robert.chen@apexconstruction.com', role: 'super_admin', status: 'Active', created_at: '2026-01-15' },
    { id: 2, username: 'admin', name: 'Sarah Jenkins', email: 'sarah.jenkins@apexconstruction.com', role: 'admin', status: 'Active', created_at: '2026-02-01' },
    { id: 3, username: 'engineer', name: 'Engr. Marcus Vance', email: 'marcus.vance@apexconstruction.com', role: 'engineer', status: 'Active', created_at: '2026-03-10' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form State
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'engineer'>('admin');
  const [formError, setFormError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users`);
      if (res.data && res.data.status === 'success') {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.warn('Backend user endpoint fallback');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newUsername.trim() || !newName.trim()) {
      setFormError('Username and Full Name are required.');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/users/create`, {
        username: newUsername,
        name: newName,
        email: newEmail,
        role: newRole
      });

      if (res.data && res.data.status === 'success') {
        setUsers((prev) => [...prev, res.data.data]);
        setIsAddUserModalOpen(false);
        setNewUsername('');
        setNewName('');
        setNewEmail('');
      } else {
        setFormError(res.data?.message || 'Error creating user account');
      }
    } catch (err: any) {
      // Local fallback
      const newUser: SystemUser = {
        id: Date.now(),
        username: newUsername.trim().toLowerCase(),
        name: newName.trim(),
        email: newEmail.trim() || `${newUsername.trim().toLowerCase()}@apexconstruction.com`,
        role: newRole,
        status: 'Active',
        created_at: new Date().toISOString().split('T')[0]
      };
      setUsers((prev) => [...prev, newUser]);
      setIsAddUserModalOpen(false);
      setNewUsername('');
      setNewName('');
      setNewEmail('');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRecords = filteredUsers.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRoleBadge = (role: UserRole) => {
    if (role === 'super_admin') {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300 font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
          👑 Super Admin
        </span>
      );
    }
    if (role === 'admin') {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300 font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
          📊 Admin
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
        🛠️ Engineer
      </span>
    );
  };

  return (
    <div className="flex-1 bg-slate-100 p-4 sm:p-6 overflow-y-auto select-none font-sans flex flex-col justify-between">
      <div>
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" /> Super Admin User Management
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Create, assign roles, and manage access credentials for Admin and Engineer accounts.
            </p>
          </div>

          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Add Admin / Engineer User
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search system users by name, username, email, or role..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Desktop Users Directory Table (hidden md:block) */}
        <div className="hidden md:block bg-white border border-slate-200 rounded-t-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#162740] text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Username</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3 text-center">Account Status</th>
                <th className="p-3 text-right">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedUsers.map((u) => (
                <tr key={`desktop-user-${u.id}`} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xs border border-purple-200">
                      {u.name.charAt(0)}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="p-3 font-mono text-slate-600">@{u.username}</td>
                  <td className="p-3 font-semibold text-slate-700">{u.email}</td>
                  <td className="p-3">{getRoleBadge(u.role)}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center gap-1 w-20 mx-auto">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {u.status}
                    </span>
                  </td>
                  <td className="p-3 text-right font-semibold text-slate-400">{u.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile User Cards View (block md:hidden) */}
        <div className="md:hidden space-y-3 mb-4">
          {paginatedUsers.map((u) => (
            <div key={`mobile-user-${u.id}`} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xs border border-purple-200">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{u.name}</h4>
                    <span className="text-[10px] font-mono text-slate-500">@{u.username}</span>
                  </div>
                </div>
                {getRoleBadge(u.role)}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-600 font-semibold truncate max-w-[200px]">{u.email}</span>
                <span className="text-[10px] text-slate-400 font-medium">{u.created_at}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Bar */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(num) => {
          setItemsPerPage(num);
          setCurrentPage(1);
        }}
        itemsPerPageOptions={[5, 10, 20, 50]}
      />

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#162740] border border-[#21385c] rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-white">
            <button
              onClick={() => setIsAddUserModalOpen(false)}
              className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black tracking-tight mb-1 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-purple-400" /> Create System User Account
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Super Admin privilege: Register a new Admin or Engineer user.
            </p>

            {formError && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-200 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Assign User Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewRole('admin')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      newRole === 'admin'
                        ? 'bg-sky-600 border-sky-400 text-white shadow-md'
                        : 'bg-[#0d1829] border-[#21385c] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>📊 Admin User</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewRole('engineer')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      newRole === 'engineer'
                        ? 'bg-amber-600 border-amber-400 text-white shadow-md'
                        : 'bg-[#0d1829] border-[#21385c] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🛠️ Engineer User</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="e.g. David Miller"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-[#0d1829] border border-[#21385c] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Username
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="e.g. david_miller"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full bg-[#0d1829] border border-[#21385c] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="e.g. david.miller@apexconstruction.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-[#0d1829] border border-[#21385c] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white shadow-md transition-colors cursor-pointer"
                >
                  Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
