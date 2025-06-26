const CourseEnrollment = require('../models/CourseEnrollment');
const Certificate = require('../models/Certificate');
const Assessment = require('../models/Assessment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');
const User = require('../models/User');

// 🎓 Candidate Dashboard
exports.getCandidateDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied',
        data: null
      });
    }

    const enrolledCourses = await CourseEnrollment.find({ user_id: req.user._id })
      .populate('course_id');

    const certificates = await Certificate.find({ user_id: req.user._id })
      .populate('course_id');

    const submissions = await Submission.find({ user_id: req.user._id })
      .populate('assessment_id');

    res.status(200).json({
      status: 'success',
      message: 'Candidate dashboard fetched successfully',
      data: {
        enrolledCourses,
        certificates,
        submissions
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch candidate dashboard',
      data: null
    });
  }
};

// 🧑‍💼 Recruiter Dashboard
exports.getRecruiterDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied',
        data: null
      });
    }

    const courses = await Course.find({ created_by: req.user._id });

    const assessments = await Assessment.find({ recruiter_id: req.user._id });

    const myAssessmentIds = assessments.map(a => a._id);
    const submissions = await Submission.find({ assessment_id: { $in: myAssessmentIds } })
      .populate('user_id assessment_id');

    res.status(200).json({
      status: 'success',
      message: 'Recruiter dashboard fetched successfully',
      data: {
        courses,
        assessments,
        submissions
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch recruiter dashboard',
      data: null
    });
  }
};

// 🛡️ Admin Dashboard
exports.getAdminDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied',
        data: null
      });
    }

    const users = await User.find().select('name email role');

    const pendingCourses = await Course.find({ approved: false }).populate('created_by');

    res.status(200).json({
      status: 'success',
      message: 'Admin dashboard fetched successfully',
      data: {
        users,
        pendingCourses
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch admin dashboard',
      data: null
    });
  }
};
