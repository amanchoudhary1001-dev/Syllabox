const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const Material = require('../models/Material');
const auth = require('../middleware/auth');

// Multer configuration (memory storage, 50MB limit)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// ✅ Helper to get GridFS bucket
const getBucket = () => {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('❌ MongoDB connection not established');
  }
  return new mongoose.mongo.GridFSBucket(db, {
    bucketName: 'uploads'
  });
};

// ✅ @route   POST /api/materials/upload
// ✅ @desc    Upload a material with GridFS
// ✅ @access  Private
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    console.log('📤 UPLOAD STARTED');
    console.log('User ID:', req.user.id);
    console.log('File:', req.file ? req.file.originalname : 'No file');
    console.log('File size:', req.file ? req.file.size : 0);

    const { title, description, subject, semester, branches } = req.body;

    // ✅ Validate required fields
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    if (!title || !subject || !semester) {
      return res.status(400).json({ message: 'Title, subject, and semester are required' });
    }

    // ✅ Parse branches
    let branchesArray = [];
    if (branches) {
      try {
        branchesArray = JSON.parse(branches);
      } catch (e) {
        if (branches.includes(',')) {
          branchesArray = branches.split(',').map(b => b.trim());
        } else {
          branchesArray = [branches];
        }
      }
    }

    if (branchesArray.length === 0) {
      branchesArray = [req.user.branch || 'CSE'];
    }

    console.log('📁 Branches:', branchesArray);

    // ✅ Upload to GridFS
    const bucket = getBucket();
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype
    });

    const fileId = uploadStream.id;
    console.log('✅ GridFS fileId created:', fileId);

    await new Promise((resolve, reject) => {
      uploadStream.end(req.file.buffer, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    console.log('✅ GridFS upload complete');

    // ✅ Create and SAVE material with ALL required fields
    const material = new Material({
      title: title.trim(),
      description: description ? description.trim() : '',
      subject: subject.trim(),
      semester: parseInt(semester),
      branches: branchesArray,
      fileId: fileId,              // ✅ CRITICAL: GridFS file reference
      filename: req.file.originalname, // ✅ CRITICAL: Original filename
      fileType: req.file.mimetype,     // ✅ CRITICAL: File type
      fileSize: req.file.size,         // ✅ File size
      uploadedBy: req.user.id
    });

    // ✅ Save to database
    await material.save();
    console.log('✅ MATERIAL SAVED TO DATABASE');
    console.log('📄 Material ID:', material._id);
    console.log('📁 File ID:', material.fileId);
    console.log('📄 Filename:', material.filename);

    res.status(201).json({
      message: 'Material uploaded successfully',
      material: material
    });

  } catch (error) {
    console.error('❌ UPLOAD ERROR:', error);
    res.status(500).json({
      message: 'Server error: ' + error.message
    });
  }
});

// ✅ @route   GET /api/materials
// ✅ @desc    Get all materials with filters
// ✅ @access  Public
router.get('/', async (req, res) => {
  try {
    const { branch, semester, subject, search } = req.query;

    let query = {};

    if (branch && branch !== '') {
      query.branches = { $in: [branch] };
    }

    if (semester && semester !== '') {
      query.semester = parseInt(semester);
    }

    if (subject && subject !== '') {
      query.subject = { $regex: subject, $options: 'i' };
    }

    if (search && search !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('🔍 Query:', query);

    const materials = await Material.find(query)
      .populate('uploadedBy', 'name email branch semester')
      .sort({ createdAt: -1 });

    console.log('📚 Found materials:', materials.length);

    res.json(materials);
  } catch (error) {
    console.error('❌ FETCH ERROR:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// ✅ @route   GET /api/materials/:id
// ✅ @desc    Get single material
// ✅ @access  Public
router.get('/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('uploadedBy', 'name email branch semester');

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.json(material);
  } catch (error) {
    console.error('❌ FETCH/:ID ERROR:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// ✅ @route   GET /api/materials/download/:id
// ✅ @desc    Download file from GridFS
// ✅ @access  Public
router.get('/download/:id', async (req, res) => {
  try {
    console.log('📥 DOWNLOAD REQUEST for material:', req.params.id);

    // ✅ Find material by its _id
    const material = await Material.findById(req.params.id);

    if (!material) {
      console.log('❌ Material not found');
      return res.status(404).json({ message: 'Material not found' });
    }

    console.log('📄 Material title:', material.title);
    console.log('📁 fileId in DB:', material.fileId);
    console.log('📄 filename in DB:', material.filename);

    // ✅ Check if fileId exists
    if (!material.fileId) {
      console.log('❌ No fileId in material document');
      return res.status(404).json({ message: 'File ID not found in material' });
    }

    // ✅ Increment download count
    material.downloads = (material.downloads || 0) + 1;
    await material.save();

    // ✅ Get file from GridFS
    const bucket = getBucket();
    const downloadStream = bucket.openDownloadStream(material.fileId);

    // ✅ Set headers
    res.setHeader('Content-Type', material.fileType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${material.filename || 'download'}"`);

    // ✅ Pipe file to response
    downloadStream.pipe(res);

    // ✅ Handle stream errors
    downloadStream.on('error', (error) => {
      console.error('❌ Stream error:', error);
      if (!res.headersSent) {
        res.status(404).json({ message: 'File not found in GridFS' });
      }
    });

  } catch (error) {
    console.error('❌ DOWNLOAD ERROR:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// ✅ @route   DELETE /api/materials/:id
// ✅ @desc    Delete a material and its file
// ✅ @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('🗑️ DELETE REQUEST for material:', req.params.id);

    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // ✅ Check if user is the owner
    if (material.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'You are not authorized to delete this material'
      });
    }

    // ✅ Delete file from GridFS
    if (material.fileId) {
      try {
        const bucket = getBucket();
        await bucket.delete(material.fileId);
        console.log('✅ File deleted from GridFS');
      } catch (err) {
        console.warn('⚠️ File not found in GridFS, skipping deletion');
      }
    }

    // ✅ Delete material from database
    await Material.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Material deleted successfully',
      materialId: req.params.id
    });

  } catch (error) {
    console.error('❌ DELETE ERROR:', error);
    res.status(500).json({
      message: 'Server error: ' + error.message
    });
  }
});

// ✅ @route   GET /api/materials/user/me
// ✅ @desc    Get current user's materials
// ✅ @access  Private
router.get('/user/me', auth, async (req, res) => {
  try {
    const materials = await Material.find({ uploadedBy: req.user.id })
      .populate('uploadedBy', 'name email branch semester')
      .sort({ createdAt: -1 });

    console.log('📚 User materials:', materials.length);

    res.json(materials);
  } catch (error) {
    console.error('❌ FETCH USER MATERIALS ERROR:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// ✅ @route   POST /api/materials/:id/rate
// ✅ @desc    Rate a material
// ✅ @access  Private
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    const totalReviews = (material.totalReviews || 0) + 1;
    const avgRating = ((material.avgRating || 0) * (material.totalReviews || 0) + rating) / totalReviews;

    material.avgRating = parseFloat(avgRating.toFixed(1));
    material.totalReviews = totalReviews;
    await material.save();

    res.json({
      message: 'Rating submitted',
      avgRating: material.avgRating,
      totalReviews: material.totalReviews
    });
  } catch (error) {
    console.error('❌ RATE ERROR:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;