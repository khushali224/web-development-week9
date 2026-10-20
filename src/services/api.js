import axios from 'axios';

export const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
export const isDemoMode = !apiBaseUrl;

export const api = axios.create({
  baseURL: apiBaseUrl || '',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('launchpad_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const demoJobs = [
  {
    _id: 'demo-1', title: 'Frontend Developer Intern', company: 'Northstar Studio',
    location: 'Remote · India', type: 'Internship', experience: 'Entry level',
    salary: '₹18,000 / month', posted: '2 days ago', featured: true,
    description: 'Join a small product team building thoughtful tools for the next generation of creators. You will ship accessible interfaces, learn from senior engineers, and own features from idea to release.',
    skills: ['React', 'JavaScript', 'CSS', 'Figma'], deadline: 'Nov 15, 2026',
  },
  {
    _id: 'demo-2', title: 'Product Design Intern', company: 'Forma Labs',
    location: 'Bengaluru, India', type: 'Internship', experience: 'Entry level',
    salary: '₹22,000 / month', posted: '1 day ago', featured: false,
    description: 'Help define the experience of a new generation of digital products. Work closely with design and engineering to prototype, test, and refine useful, clear experiences.',
    skills: ['Figma', 'Prototyping', 'Research', 'UI Design'], deadline: 'Nov 20, 2026',
  },
  {
    _id: 'demo-3', title: 'Junior Backend Engineer', company: 'Cloudside',
    location: 'Pune, India', type: 'Full-time', experience: '1–2 years',
    salary: '₹6–8 LPA', posted: '3 days ago', featured: false,
    description: 'Build dependable APIs and services alongside a collaborative engineering team. We value curiosity, clear communication, and a strong foundation in modern web development.',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'], deadline: 'Nov 28, 2026',
  },
  {
    _id: 'demo-4', title: 'Data Analyst Intern', company: 'GoodMeasure',
    location: 'Remote · India', type: 'Internship', experience: 'Entry level',
    salary: '₹16,000 / month', posted: '5 days ago', featured: false,
    description: 'Turn real customer and product questions into useful insights. Work with analysts to build dashboards, explore datasets, and share findings with the wider team.',
    skills: ['SQL', 'Python', 'Excel', 'Data visualization'], deadline: 'Dec 02, 2026',
  },
  {
    _id: 'demo-5', title: 'Community & Content Intern', company: 'Open House',
    location: 'Mumbai, India', type: 'Internship', experience: 'Entry level',
    salary: '₹15,000 / month', posted: '1 week ago', featured: false,
    description: 'Create helpful stories and experiences for a growing community. Bring ideas, care about craft, and help make our online spaces welcoming and useful.',
    skills: ['Writing', 'Social media', 'Canva', 'Communication'], deadline: 'Dec 05, 2026',
  },
  {
    _id: 'demo-6', title: 'React Developer', company: 'Daybreak Tech',
    location: 'Hyderabad, India', type: 'Full-time', experience: '1–2 years',
    salary: '₹8–10 LPA', posted: '4 days ago', featured: true,
    description: 'Create fast, accessible web experiences with a team that cares about the details. You will collaborate across product, design, and engineering to deliver meaningful improvements.',
    skills: ['React', 'TypeScript', 'Testing', 'Accessibility'], deadline: 'Dec 10, 2026',
  },
];

export function normalizeJobs(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.jobs)) return data.jobs;
  if (Array.isArray(data?.data)) return data.data;
  throw new Error('The jobs API returned an unexpected response.');
}

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback;
}
