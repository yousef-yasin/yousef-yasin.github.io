// Skills, experience, achievements, education and certifications. Source of truth: CV.

export const skills = [
  { group: 'AI & Machine Learning', code: 'AI', items: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP', 'LLMs', 'Agent-based Systems'] },
  { group: 'Programming', code: 'PRG', items: ['Python', 'C++', 'JavaScript', 'HTML', 'CSS'] },
  { group: 'Data Science', code: 'DS', items: ['Pandas', 'NumPy', 'Scikit-learn', 'Data Analysis', 'Power BI'] },
  { group: 'Backend & Databases', code: 'BE', items: ['FastAPI', 'MySQL'] },
  { group: 'Tools & Technologies', code: 'TL', items: ['Git', 'GitHub', 'Arduino', 'Microcontrollers', 'Robotics'] },
];

// Newest first.
export const experience = [
  {
    role: 'AI Engineer Intern',
    org: 'Shamsi Technical Company',
    period: 'May 2026 – Aug 2026',
    points: [
      'Developed and implemented AI-based solutions within an AI engineering training program.',
      'Worked on AI/ML development, data processing and model-related tasks using Python and machine learning.',
      'Applied machine learning techniques to practical AI problems and technical workflows.',
    ],
  },
  {
    role: 'Vice Chairman (Robotics Trainer)',
    org: 'IEEE Robotics and Automation Society — AAU',
    period: 'Leadership',
    points: [
      'Trained students in robotics development and programming.',
      'Delivered 16 technical training courses covering Computer Vision, AI Agents and Robotics.',
    ],
  },
  {
    role: 'AI & Machine Learning Intern',
    org: 'Hope International Company',
    period: 'Feb 2025 – Apr 2025',
    points: [
      'Applied Python and machine learning techniques to practical data-related problems.',
      'Worked on AI development tasks, data analysis and machine learning workflows.',
    ],
  },
];

export const achievements = [
  { place: '1st', title: 'IEEE JSYP Competition', detail: 'Artificial Intelligence & IoT Category' },
  { place: '1st', title: 'Robot Collector Ball Competition', detail: '' },
  { place: '2nd', title: 'RoboCraft Competition', detail: 'Best Idea in Smart Agriculture' },
  { place: '2nd', title: 'Problem Solving Competition', detail: 'Amman Arab University' },
  { place: '3rd', title: 'AstroCode', detail: 'IEEE' },
];

export const education = {
  degree: 'Bachelor of Science in Data Science & Artificial Intelligence',
  school: 'Amman Arab University (AAU)',
  period: 'Expected 2027',
  location: 'Amman, Jordan',
};

export const certifications = [
  { title: 'Web Application Development with AI', issuer: 'Crown Prince Foundation' },
  { title: 'Python & Machine Learning', issuer: 'Hope International Company' },
  { title: 'Generative AI', issuer: '' },
  { title: 'Power BI', issuer: '' },
  { title: 'Arduino & Microcontrollers Basics', issuer: '' },
];
