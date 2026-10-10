/**
 * Mock / demo data for NextHire AI UI.
 * Replace usage with live API responses via services/api.js later.
 */

export const mockProfile = {
  fullName: 'Aarav Sharma',
  email: 'aarav.sharma@college.edu',
  university: 'Example Institute of Technology',
  degree: 'BCA',
  semester: '5',
  targetCareer: 'Machine Learning Engineer',
  skills: ['Python', 'Machine Learning', 'React', 'JavaScript', 'Pandas', 'NumPy', 'Git'],
  careerInterests: ['AI/ML', 'Data Science', 'Software Engineering'],
  profileCompletion: 85,
};

export const mockDashboard = {
  greetingName: 'Aarav',
  careerReadinessScore: 82,
  scores: {
    resume: 84,
    jobMatch: 86,
    interview: 78,
    skillReadiness: 80,
  },
  readinessHistory: [
    { month: 'Jan', score: 58 },
    { month: 'Feb', score: 62 },
    { month: 'Mar', score: 68 },
    { month: 'Apr', score: 72 },
    { month: 'May', score: 76 },
    { month: 'Jun', score: 82 },
  ],
  recommendedCareer: {
    title: 'Machine Learning Engineer',
    matchPercentage: 87,
  },
  prioritySkills: ['SQL', 'Docker', 'Git', 'Deep Learning'],
  recentActivity: [
    { id: 1, text: 'Resume analyzed', time: '2 hours ago' },
    { id: 2, text: 'Completed mock interview', time: 'Yesterday' },
    { id: 3, text: 'New career recommendation generated', time: '3 days ago' },
    { id: 4, text: 'Job match score updated', time: '5 days ago' },
  ],
};

export const mockResumeAnalysis = {
  overallScore: 82,
  breakdown: {
    skills: 90,
    projects: 80,
    education: 95,
    experience: 65,
    keywords: 78,
    structure: 82,
  },
  weights: {
    skills: 25,
    projects: 20,
    education: 15,
    experience: 15,
    keywords: 15,
    structure: 10,
  },
  strengths: [
    'Strong technical skills',
    'Relevant projects',
    'Good educational background',
  ],
  improvements: [
    'Add measurable project achievements',
    'Improve keyword alignment',
    'Add relevant certifications',
  ],
  extractedSkills: [
    'Python',
    'JavaScript',
    'React',
    'SQL',
    'Machine Learning',
  ],
  info: {
    name: 'Aarav Sharma',
    education: ['BCA — Example Institute of Technology'],
    projects: ['Student Performance Predictor', 'Campus Job Portal'],
    experience: ['Python Intern — Data Labs (2025)'],
    certifications: ['Google Data Analytics (in progress)'],
  },
};

export const mockJobMatch = {
  compatibility: 84,
  matchedSkills: ['Python', 'Machine Learning', 'Pandas', 'NumPy', 'Scikit-learn'],
  missingSkills: ['SQL', 'Docker', 'Git'],
  explanation:
    'Match scores will be computed by the backend using NLP and semantic similarity between your resume and the job description.',
};

export const mockCareerRecommendations = [
  {
    id: 'mle',
    career: 'Machine Learning Engineer',
    matchPercentage: 87,
    skills: ['Python', 'Machine Learning', 'NumPy', 'Pandas'],
    missingSkills: ['Docker', 'MLOps', 'Deep Learning'],
    description:
      'Build and deploy ML models that solve real-world problems at scale.',
  },
  {
    id: 'da',
    career: 'Data Analyst',
    matchPercentage: 82,
    skills: ['Python', 'Pandas', 'SQL basics'],
    missingSkills: ['Tableau', 'Advanced SQL', 'Statistics'],
    description:
      'Turn raw data into clear insights that drive business decisions.',
  },
  {
    id: 'ds',
    career: 'Data Scientist',
    matchPercentage: 76,
    skills: ['Python', 'Machine Learning', 'Statistics basics'],
    missingSkills: ['Deep Learning', 'Experiment Design', 'Cloud ML'],
    description:
      'Combine statistics, ML, and domain knowledge to extract predictive value.',
  },
];

export const mockInterviewQuestions = [
  {
    id: 1,
    question: 'Explain overfitting and how you can prevent it.',
    type: 'Technical',
  },
  {
    id: 2,
    question: 'Tell me about a project where you used machine learning.',
    type: 'Behavioral',
  },
  {
    id: 3,
    question: 'What is the difference between supervised and unsupervised learning?',
    type: 'Technical',
  },
];

export const mockInterviewEvaluation = {
  technicalAccuracy: 84,
  relevance: 91,
  completeness: 78,
  clarity: 82,
  overall: 84,
  feedback:
    'Your answer correctly explains the concept. Consider including regularization techniques such as L1/L2 regularization and dropout.',
};
