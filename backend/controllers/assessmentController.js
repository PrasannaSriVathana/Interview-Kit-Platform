const Assessment = require('../models/Assessment');
const Question = require('../models/Question');
const Submission = require('../models/Submission');
const SubmissionAnswer = require('../models/SubmissionAnswer');

// 🧑‍💼 Recruiter: Create Assessment
exports.createAssessment = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({
        status: 'error',
        message: 'Only recruiters can create assessments',
        data: null
      });
    }

    const { title, description, duration_min } = req.body;

    const assessment = await Assessment.create({
      recruiter_id: req.user._id,
      title,
      description,
      duration_min
    });

    res.status(201).json({
      status: 'success',
      message: 'Assessment created successfully',
      data: { assessment }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create assessment',
      data: null
    });
  }
};

// 📄 Add Questions to Assessment
exports.addQuestion = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({
        status: 'error',
        message: 'Only recruiters can add questions',
        data: null
      });
    }

    const { assessment_id, type, question, options, correct_ans, difficulty } = req.body;

    const newQuestion = await Question.create({
      assessment_id,
      type,
      question,
      options,
      correct_ans,
      difficulty
    });

    res.status(201).json({
      status: 'success',
      message: 'Question added successfully',
      data: { question: newQuestion }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add question',
      data: null
    });
  }
};

// 👀 Get Questions (for candidate to attempt)
exports.getAssessmentQuestions = async (req, res) => {
  try {
    const { assessment_id } = req.params;
    const questions = await Question.find({ assessment_id }).select('-correct_ans');

    res.status(200).json({
      status: 'success',
      message: 'Assessment questions fetched successfully',
      data: { questions }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch questions',
      data: null
    });
  }
};

// 🧑‍🎓 Candidate: Submit assessment answers
exports.submitAssessment = async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({
        status: 'error',
        message: 'Only candidates can submit assessments',
        data: null
      });
    }

    const { assessment_id, answers } = req.body;

    const submission = await Submission.create({
      user_id: req.user._id,
      assessment_id,
      submitted_at: new Date(),
      score: 0,
      feedback: ''
    });

    let totalScore = 0;

    for (const ans of answers) {
      const question = await Question.findById(ans.question_id);
      let score = 0;

      if (question && question.correct_ans === ans.answer) {
        score = 1;
        totalScore += score;
      }

      await SubmissionAnswer.create({
        submission_id: submission._id,
        question_id: ans.question_id,
        answer: ans.answer,
        score
      });
    }

    submission.score = totalScore;
    await submission.save();

    res.status(201).json({
      status: 'success',
      message: 'Assessment submitted successfully',
      data: { submission }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Assessment submission failed',
      data: null
    });
  }
};

// 🧑‍💼 Recruiter: View submissions for an assessment
exports.viewSubmissions = async (req, res) => {
  try {
    const { assessment_id } = req.params;

    if (req.user.role !== 'recruiter') {
      return res.status(403).json({
        status: 'error',
        message: 'Only recruiters can view submissions',
        data: null
      });
    }

    const submissions = await Submission.find({ assessment_id }).populate('user_id');

    res.status(200).json({
      status: 'success',
      message: 'Submissions fetched successfully',
      data: { submissions }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch submissions',
      data: null
    });
  }
};
