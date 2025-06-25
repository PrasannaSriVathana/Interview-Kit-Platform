const Course = require('../models/Course');
const CourseModule = require('../models/CourseModule');
const CourseEnrollment = require('../models/CourseEnrollment');

// 📚 1. Create a Course (Recruiter only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, level } = req.body;

    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can create courses' });
    }

    const course = await Course.create({
      title,
      description,
      level,
      created_by: req.user._id,
      approved: false
    });

    res.status(201).json({ message: 'Course created', course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create course' });
  }
};

// 📦 2. Add Module to Course
exports.addCourseModule = async (req, res) => {
  try {
    const { course_id, title, type, content_url, order_index } = req.body;

    if (req.user.role !== 'recruiter' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only recruiters or admins can add modules' });
    }

    const newModule = await CourseModule.create({
      course_id,
      title,
      type,
      content_url,
      order_index
    });

    res.status(201).json({ message: 'Module added', module: newModule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add module' });
  }
};

// 🧑‍🎓 3. Enroll Candidate in Course
exports.enrollInCourse = async (req, res) => {
  try {
    const { course_id } = req.body;

    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can enroll in courses' });
    }

    const course = await Course.findById(course_id);
    if (!course || !course.approved) {
      return res.status(400).json({ message: 'Course not available for enrollment' });
    }

    const alreadyEnrolled = await CourseEnrollment.findOne({
      course_id,
      user_id: req.user._id
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await CourseEnrollment.create({
      course_id,
      user_id: req.user._id,
      progress: 0,
      completed: false,
      certificate_url: ''
    });

    res.status(201).json({ message: 'Enrollment successful', enrollment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Enrollment failed' });
  }
};

// 📜 4. Get All Approved Courses (Public)
exports.getAllApprovedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ approved: true });
    res.status(200).json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

// 🧾 5. Admin Approves a Course
exports.approveCourse = async (req, res) => {
  try {
    const { course_id } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can approve courses' });
    }

    const course = await Course.findByIdAndUpdate(course_id, { approved: true }, { new: true });

    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.status(200).json({ message: 'Course approved', course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to approve course' });
  }
};

// 👤 6. Get Courses Enrolled by Logged-in Candidate
exports.getMyCourses = async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can view enrolled courses' });
    }

    const enrollments = await CourseEnrollment.find({ user_id: req.user._id }).populate('course_id');
    res.status(200).json(enrollments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch enrolled courses' });
  }
};

exports.markModuleComplete = async (req, res) => {
  try {
    const { course_id, module_id } = req.body;

    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can mark progress' });
    }

    // Fetch all modules
    const allModules = await CourseModule.find({ course_id });
    const totalModules = allModules.length;

    if (totalModules === 0) {
      return res.status(400).json({ message: 'Course has no modules' });
    }

    // Fetch enrollment
    const enrollment = await CourseEnrollment.findOne({
      course_id,
      user_id: req.user._id
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }

    // Track completed module IDs (assume you store this in enrollment optionally)
    if (!enrollment.completedModules) {
      enrollment.completedModules = [];
    }

    if (!enrollment.completedModules.includes(module_id)) {
      enrollment.completedModules.push(module_id);
    }

    const completedCount = enrollment.completedModules.length;
    const progress = Math.round((completedCount / totalModules) * 100);

    enrollment.progress = progress;
    enrollment.completed = progress === 100;

    await enrollment.save();

    res.status(200).json({
      message: 'Module marked complete',
      progress: enrollment.progress,
      completed: enrollment.completed
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update progress' });
  }
};