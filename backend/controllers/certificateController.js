
const Certificate = require('../models/Certificate');
const CourseEnrollment = require('../models/CourseEnrollment');
const Course = require('../models/Course');

exports.generateCertificate = async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can generate certificates' });
    }

    const { course_id } = req.body;

    // Check if enrolled and completed
    const enrollment = await CourseEnrollment.findOne({
      course_id,
      user_id: req.user._id
    });

    if (!enrollment || !enrollment.completed) {
      return res.status(400).json({ message: 'Course not completed or not enrolled' });
    }

    // Check if already has certificate
    const existing = await Certificate.findOne({
      course_id,
      user_id: req.user._id
    });

    if (existing) {
      return res.status(200).json({ message: 'Certificate already issued', certificate: existing });
    }

    // Generate fake URL (in real use, generate PDF or static image)
    const certificate_url = `https://yourdomain.com/certificates/${req.user._id}-${course_id}.pdf`;

    const certificate = await Certificate.create({
      course_id,
      user_id: req.user._id,
      certificate_url,
      issued_at: new Date()
    });

    // Save URL to enrollment
    enrollment.certificate_url = certificate_url;
    await enrollment.save();

    res.status(201).json({ message: 'Certificate generated', certificate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Certificate generation failed' });
  }
};

// 🎓 Candidate: View my certificates
exports.getMyCertificates = async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can view certificates' });
    }

    const certs = await Certificate.find({ user_id: req.user._id }).populate('course_id');
    res.status(200).json(certs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch certificates' });
  }
};
