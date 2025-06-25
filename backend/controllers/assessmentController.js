const Assessment = require('../models/Assessment');
const Question = require('../models/Question');
const Submission = require('../models/Submission');
const SubmissionAnswer = require('../models/SubmissionAnswer');

// 🧑‍💼 Recruiter: Create Assessment
exports.createAssessment = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can create assessments' });
    }

    const { title, description, duration_min } = req.body;

    const assessment = await Assessment.create({
      recruiter_id: req.user._id,
      title,
      description,
      duration_min
    });

    res.status(201).json({ message: 'Assessment created', assessment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create assessment' });
  }
};

// 📄 Add Questions to Assessment
exports.addQuestion = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can add questions' });
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

    res.status(201).json({ message: 'Question added', newQuestion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add question' });
  }
};

// 👀 Get Questions (for candidate to attempt)
exports.getAssessmentQuestions = async (req, res) => {
  try {
    const { assessment_id } = req.params;
    const questions = await Question.find({ assessment_id }).select('-correct_ans'); // hide answers
    res.status(200).json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
};

// 🧑‍🎓 Candidate: Submit assessment answers
exports.submitAssessment = async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can submit assessments' });
    }

    const { assessment_id, answers } = req.body;

    // Create submission
    const submission = await Submission.create({
      user_id: req.user._id,
      assessment_id,
      submitted_at: new Date(),
      score: 0, // will be updated
      feedback: ''
    });

    let totalScore = 0;

    // Save answers and calculate score
    for (const ans of answers) {
      const question = await Question.findById(ans.question_id);
      let score = 0;

      if (question && question.correct_ans) {
        if (question.correct_ans === ans.answer) {
          score = 1; // you can customize scoring
          totalScore += score;
        }
      }

      await SubmissionAnswer.create({
        submission_id: submission._id,
        question_id: ans.question_id,
        answer: ans.answer,
        score
      });
    }

    // Update total score in submission
    submission.score = totalScore;
    await submission.save();

    res.status(201).json({ message: 'Submission successful', submission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Assessment submission failed' });
  }
};

// 🧑‍💼 Recruiter: View submissions for an assessment
exports.viewSubmissions = async (req, res) => {
  try {
    const { assessment_id } = req.params;

    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can view submissions' });
    }

    const submissions = await Submission.find({ assessment_id }).populate('user_id');

    res.status(200).json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch submissions' });
  }
};
