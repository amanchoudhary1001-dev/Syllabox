import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import MaterialCard from '../components/MaterialCard';
import { Search } from 'lucide-react';

const Home = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ branch: '', semester: '', subject: '' });
  const { user } = useAuth();

  const branches = ['CSE', 'CSE-AI', 'CSE-DS', 'ECE', 'ME', 'CE', 'EE', 'IT'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    fetchMaterials();
  }, [filters]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.branch) params.append('branch', filters.branch);
      if (filters.semester) params.append('semester', filters.semester);
      if (filters.subject) params.append('subject', filters.subject);
      const res = await API.get(`/materials?${params}`);
      setMaterials(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/materials?search=${search}`);
      setMaterials(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      {/* Header - Compact */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">📚 Welcome, {user?.name}!</h1>
        <p className="text-sm text-gray-500">Discover and share study materials</p>
      </div>

      {/* Search & Filters - Compact */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[150px] relative">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
            <button onClick={handleSearch} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="h-4 w-4" />
            </button>
          </div>
          <select
            value={filters.branch}
            onChange={(e) => setFilters({...filters, branch: e.target.value})}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All Branches</option>
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select
            value={filters.semester}
            onChange={(e) => setFilters({...filters, semester: e.target.value})}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All Semesters</option>
            {semesters.map(s => <option key={s} value={s}>Sem {s}</option>)}
          </select>
          <input
            type="text"
            placeholder="Subject..."
            value={filters.subject}
            onChange={(e) => setFilters({...filters, subject: e.target.value})}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm min-w-[100px]"
          />
        </div>
      </div>

      {/* Materials Grid - Compact */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : materials.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-xl">
          <p className="text-gray-500">No materials found</p>
          <p className="text-sm text-gray-400">Upload a new material! 🚀</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {materials.map(material => (
            <MaterialCard key={material._id} material={material} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;