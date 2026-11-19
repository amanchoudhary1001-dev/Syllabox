import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, BookOpen, GraduationCap, Edit, X, Save, Upload, Download } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ uploads: 0, downloads: 0 });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    branch: user?.branch || 'CSE',
    semester: user?.semester || 1
  });

  const branches = ['CSE', 'CSE-AI', 'CSE-DS', 'ECE', 'ME', 'CE', 'EE', 'IT'];

  // ✅ Fetch real stats
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get user's uploads
      const uploadsRes = await API.get('/materials/user/me');
      const uploadCount = uploadsRes.data.length;

      // Get total downloads (sum of all downloads from user's materials)
      let downloadCount = 0;
      uploadsRes.data.forEach(material => {
        downloadCount += material.downloads || 0;
      });

      setStats({
        uploads: uploadCount,
        downloads: downloadCount
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getBranchColor = (branch) => {
    const colors = {
      'CSE': 'bg-blue-100 text-blue-700',
      'CSE-AI': 'bg-purple-100 text-purple-700',
      'CSE-DS': 'bg-green-100 text-green-700',
      'ECE': 'bg-yellow-100 text-yellow-700',
      'ME': 'bg-red-100 text-red-700',
      'CE': 'bg-orange-100 text-orange-700',
      'EE': 'bg-pink-100 text-pink-700',
      'IT': 'bg-indigo-100 text-indigo-700'
    };
    return colors[branch] || 'bg-gray-100 text-gray-700';
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put('/auth/update-profile', formData);
      toast.success('Profile updated! 🎉');
      updateUser(res.data.user);
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">👤 My Profile</h1>
        <p className="text-sm text-gray-500">View and manage your account</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-20"></div>
        
        <div className="relative px-6 pb-4">
          <div className="flex flex-col items-center -mt-10">
            <div className="w-16 h-16 rounded-full bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                {getInitials(user?.name || 'User')}
              </div>
            </div>
            <h2 className="mt-1 text-lg font-bold text-gray-900">{user?.name}</h2>
            <span className={`mt-0.5 px-3 py-0.5 rounded-full text-xs font-medium ${getBranchColor(user?.branch)}`}>
              {user?.branch}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-100 px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
              <Mail className="h-4 w-4 text-indigo-500" />
              <div>
                <p className="text-[10px] text-gray-500">Email</p>
                <p className="text-xs font-medium text-gray-900 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
              <BookOpen className="h-4 w-4 text-indigo-500" />
              <div>
                <p className="text-[10px] text-gray-500">Branch</p>
                <p className="text-xs font-medium text-gray-900">{user?.branch}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
              <GraduationCap className="h-4 w-4 text-indigo-500" />
              <div>
                <p className="text-[10px] text-gray-500">Semester</p>
                <p className="text-xs font-medium text-gray-900">Sem {user?.semester}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
              <div className="h-4 w-4 text-indigo-500 flex items-center justify-center text-sm">📅</div>
              <div>
                <p className="text-[10px] text-gray-500">Member Since</p>
                <p className="text-xs font-medium text-gray-900">
                  {user?.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                    : 'Just joined'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Stats with REAL numbers - Uploads & Downloads ONLY */}
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-center space-x-1">
                <Upload className="h-4 w-4 text-indigo-500" />
                <p className="text-xl font-bold text-indigo-600">{stats.uploads}</p>
              </div>
              <p className="text-[10px] text-gray-500">Materials Uploaded</p>
            </div>
            <div className="text-center bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-center space-x-1">
                <Download className="h-4 w-4 text-green-500" />
                <p className="text-xl font-bold text-green-600">{stats.downloads}</p>
              </div>
              <p className="text-[10px] text-gray-500">Total Downloads</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 px-4 py-3 bg-white">
          <button
            onClick={() => setIsEditing(true)}
            className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">✏️ Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Branch</label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Semester</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center">
                  {loading ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;