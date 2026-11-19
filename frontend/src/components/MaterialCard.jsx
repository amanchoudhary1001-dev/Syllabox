import React from 'react';
import { Download, User, Calendar, FileText, Star } from 'lucide-react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const MaterialCard = ({ material }) => {
  const handleDownload = async () => {
    if (!material || !material._id) {
      toast.error('No file available');
      return;
    }

    try {
      console.log('📥 Downloading material:', material._id);
      
      // ✅ Download via GridFS endpoint
      const response = await API.get(`/materials/download/${material._id}`, {
        responseType: 'blob'
      });

      // ✅ Check if response has data
      if (!response.data || response.data.size === 0) {
        toast.error('File is empty or corrupted');
        return;
      }

      // ✅ Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = material.filename || 'download.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Downloading...');
    } catch (error) {
      console.error('❌ Download error:', error);
      console.error('Error response:', error.response);
      
      const errorMsg = error.response?.data?.message || 'Failed to download file';
      toast.error(errorMsg);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
            {material.title}
          </h3>
        </div>
        <FileText className="h-4 w-4 text-indigo-500 flex-shrink-0 ml-2" />
      </div>
      
      <div className="flex flex-wrap gap-1 mt-2">
        {(material.branches || [material.branch]).map(b => (
          <span key={b} className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">
            {b}
          </span>
        ))}
        <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded">
          Sem {material.semester}
        </span>
        <span className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded">
          {material.subject}
        </span>
      </div>
      
      <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-1">
          <User className="h-3 w-3" />
          <span>{material.uploadedBy?.name || 'Unknown'}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(material.createdAt)}</span>
        </div>
      </div>

      {/* Rating Stars */}
      <div className="mt-2 flex items-center space-x-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-3 w-3 ${
                star <= (material.avgRating || 0)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">
          {material.avgRating > 0 ? `${material.avgRating} ⭐` : 'Rate this'}
        </span>
      </div>
      
      <button
        onClick={handleDownload}
        className="mt-2 w-full flex items-center justify-center space-x-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 py-1.5 rounded-lg text-xs font-medium transition-colors"
      >
        <Download className="h-3 w-3" />
        <span>Download</span>
      </button>
    </div>
  );
};

export default MaterialCard;