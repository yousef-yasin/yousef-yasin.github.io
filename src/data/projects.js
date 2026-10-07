// Project content. Cards render only the fields they have, so any field
// (links, role, highlights…) can be left out and the layout adapts.
//
// Fields: id, name, tagline, category, problem, solution, role,
//         highlights[], tech[], links { github, demo }

export const flagship = {
  id: 'qoyn',
  name: 'QOYN',
  title: 'AI Career & Learning Platform',
  // Screenshot of the live product, served from /public
  image: { src: 'projects/qoyn-home.webp', alt: 'QOYN platform home page', width: 1600, height: 880 },
  tagline:
    'An AI-powered career and learning platform that bridges the gap between education and the labour market — turning learning into verified evidence of real skill.',
  problem:
    'Students graduate with grades and certificates but little verifiable proof they can deliver real work, while companies have no low-cost way to see what a candidate can actually build.',
  solution:
    'One connected path: discover a career direction, identify skill gaps, develop through guided learning, build and prove skills on generated projects, get matched to real opportunities — and keep improving from measured results.',
  engine: {
    name: 'QOYN Potential Engine',
    short: 'QPE',
    text: 'The central intelligence layer. QPE reads the signals across a student’s whole journey — chosen path, CV, assessments, submitted projects and evaluations — and turns them into career intelligence: where they stand, what is missing, and what to do next.',
  },
  journey: [
    { step: 'Discover', text: 'Career intelligence & guidance' },
    { step: 'Identify Gaps', text: 'CV & skill gap analysis' },
    { step: 'Develop', text: 'Recommendations & AI mentor' },
    { step: 'Build / Prove', text: 'Project generation & evaluation' },
    { step: 'Connect / Match', text: 'Student ↔ project matching' },
    { step: 'Measure / Improve', text: 'Evidence feeds back into QPE' },
  ],
  capabilities: [
    { group: 'Intelligence', items: ['Career Intelligence', 'Skill Gap Analysis', 'Career Guidance', 'CV Analysis'] },
    { group: 'Growth', items: ['Recommendation Systems', 'AI Mentor', 'Project Generation', 'Project Evaluation'] },
    { group: 'Proof & Match', items: ['Evidence / Portfolio', 'Student ↔ Project Matching', 'O*NET / ESCO mapping'] },
    { group: 'AI Core', items: ['RAG + LLM', 'NLP', 'Agent-based systems'] },
  ],
  highlights: [
    'Multi-agent AI pipeline that turns a company problem into a full technical blueprint — requirements, architecture, data, API, UX, security and testing — then into tasks for students.',
    'Deterministic, weighted student-to-project matching behind a strict eligibility gate — not an LLM guess.',
    'Data processing and model evaluation workflows behind every AI feature.',
    'Integrity guard: AI-written reports are rejected if their scores disagree with the real, stored evaluation results.',
  ],
  role: 'Developed the platform’s AI-driven features — career guidance, CV analysis, recommendations, AI mentoring and project evaluation — plus the data processing and model evaluation workflows behind them.',
  tech: ['Python', 'FastAPI', 'Machine Learning', 'NLP', 'LLMs', 'Agent-based Systems', 'MySQL'],
  links: { github: 'https://github.com/yousef-yasin/qoyn-platform' },
};

// Featured case studies (shown as large editorial sections).
export const projects = [
  {
    id: 'underwater',
    visual: 'sonar', // generated visual — see components/Visuals.jsx
    name: 'Autonomous Underwater Robot',
    tagline: 'Computer-vision-based underwater robot with autonomous navigation.',
    category: 'Robotics · Computer Vision',
    problem: 'Underwater robots need to see and react to their surroundings without a human steering every move.',
    solution: 'A robotic system that uses computer vision for underwater object detection and drives autonomous navigation from what it sees.',
    role: 'Integrated the computer vision and robotics components using Python, OpenCV and Arduino.',
    highlights: ['Vision-based object detection underwater', 'Autonomous navigation', 'Software ↔ hardware integration on Arduino'],
    tech: ['Python', 'OpenCV', 'Computer Vision', 'Robotics', 'Arduino'],
    links: {},
  },
  {
    id: 'arabcafe',
    visual: 'orders',
    name: 'Arab Cafe Management System',
    tagline: 'Full-stack cafeteria ordering and management platform.',
    category: 'Full-Stack Web',
    problem: 'Running a cafeteria’s orders and menu by hand is slow and hard to manage.',
    solution: 'A web platform for cafeteria ordering with an admin dashboard and menu management.',
    role: 'Built the web application functionality end to end with Flask, Python, HTML, CSS and JavaScript.',
    highlights: ['Customer ordering flow', 'Admin dashboard', 'Menu management'],
    tech: ['Python', 'Flask', 'HTML', 'CSS', 'JavaScript'],
    links: { github: 'https://github.com/yousef-yasin/ArabCafe' },
  },
  {
    id: 'tedx',
    visual: 'devices',
    name: 'TEDx AAU Website',
    tagline: 'Responsive website for TEDx Amman Arab University.',
    category: 'Web Design & Development',
    problem: 'The TEDx AAU event needed its own web presence that works on any device.',
    solution: 'A responsive website with custom interface components and page layouts.',
    role: 'Designed and developed the website.',
    highlights: ['Responsive layouts', 'Reusable interface components'],
    tech: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
    links: {},
  },
];

// Additional public work (shown as an index list). Facts taken from each repo's README.
export const moreProjects = [
  {
    name: 'NOVA',
    text: 'Knowledge-gap discovery & reasoning engine — retrieves evidence, builds an evidence graph and detects what the evidence does not establish.',
    tech: ['Python', 'LLMs', 'RAG'],
    link: 'https://github.com/yousef-yasin/nova-knowledge-engine',
  },
  {
    name: 'Solar Site Analyzer',
    text: 'Computer-vision system that rates locations as suitable, medium or not suitable for solar panels from camera data.',
    tech: ['Python', 'Computer Vision', 'Machine Learning'],
    link: 'https://github.com/yousef-yasin/solar-site-analyzer',
  },
  {
    name: 'AI Traffic Intelligence Platform',
    text: 'Traffic intelligence and infrastructure simulation platform built for the JSYP Hackathon — YOLO vision with SUMO simulation.',
    tech: ['Python', 'YOLO', 'OpenCV', 'SUMO'],
    link: 'https://github.com/yousef-yasin/AI-Traffic-Intelligence-Platform',
  },
  {
    name: 'AI Knowledge Assistant',
    text: 'RAG assistant with hybrid search, validated Gemini answers, source citations and an evaluation suite.',
    tech: ['Python', 'RAG', 'Gemini', 'ChromaDB'],
    link: 'https://github.com/yousef-yasin/AI-Knowledge-Assistant',
  },
  {
    name: 'AURORA',
    text: 'Autonomous AI engineering & research lab — nine cooperating agents analyse a repo or dataset and write one grounded report.',
    tech: ['Python', 'FastAPI', 'Multi-agent'],
    link: 'https://github.com/yousef-yasin/AURORA',
  },
  {
    name: 'Attendance Manager',
    text: 'Offline Windows desktop app that turns instructors’ existing Excel attendance exports into managed records and reports.',
    tech: ['Python', 'PySide6'],
    link: 'https://github.com/yousef-yasin/attendance-manager',
  },
];
