const Certificate = require('../models/Certificate');
const CourseEnrollment = require('../models/CourseEnrollment');
const Course = require('../models/Course');

// 🎓 Candidate: Generate certificate
exports.generateCertificate = async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({
        status: 'error',
        message: 'Only candidates can generate certificates',
        data: null
      });
    }

    const { course_id } = req.body;

    const enrollment = await CourseEnrollment.findOne({
      course_id,
      user_id: req.user._id
    });

    if (!enrollment || !enrollment.completed) {
      return res.status(400).json({
        status: 'error',
        message: 'Course not completed or not enrolled',
        data: null
      });
    }

    const existing = await Certificate.findOne({
      course_id,
      user_id: req.user._id
    });

    if (existing) {
      return res.status(200).json({
        status: 'success',
        message: 'Certificate already issued',
        data: { certificate: existing }
      });
    }

    const certificate_url = `https://yourdomain.com/certificates/${req.user._id}-${course_id}.pdf`;

    const certificate = await Certificate.create({
      course_id,
      user_id: req.user._id,
      certificate_url,
      issued_at: new Date()
    });

    enrollment.certificate_url = certificate_url;
    await enrollment.save();

    res.status(201).json({
      status: 'success',
      message: 'Certificate generated successfully',
      data: { certificate }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Certificate generation failed',
      data: null
    });
  }
};

// 🎓 Candidate: View my certificates
exports.getMyCertificates = async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({
        status: 'error',
        message: 'Only candidates can view certificates',
        data: null
      });
    }

    const certs = await Certificate.find({ user_id: req.user._id }).populate('course_id');

    res.status(200).json({
      status: 'success',
      message: 'Certificates fetched successfully',
      data: { certificates: certs }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch certificates',
      data: null
    });
  }
};
