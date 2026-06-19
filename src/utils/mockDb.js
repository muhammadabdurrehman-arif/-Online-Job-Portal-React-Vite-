// Local Mock Database & Storage Management

const SEED_VERSION = '1.2';

const INITIAL_COMPANIES = [
  {
    id: 'comp_1',
    name: 'TechFlow Solutions',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60',
    industry: 'Software Engineering',
    website: 'https://techflow.io',
    description: 'TechFlow Solutions is a leading provider of cloud-native development tools and workflow automation platforms.',
    address: '100 Silicon Valley Blvd, San Jose, CA'
  },
  {
    id: 'comp_2',
    name: 'Apex Data Corp',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=60',
    industry: 'Data Analytics & AI',
    website: 'https://apexdata.ai',
    description: 'We empower enterprise companies with real-time predictive analytics and cutting-edge machine learning solutions.',
    address: '500 Broadway St, New York, NY'
  },
  {
    id: 'comp_3',
    name: 'PixelForge Studios',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=60',
    industry: 'Design & Frontend Development',
    website: 'https://pixelforge.design',
    description: 'PixelForge is an award-winning creative agency developing immersive web interfaces and branding systems.',
    address: '742 Evergreen Terrace, Austin, TX'
  }
];

const INITIAL_JOBS = [
  {
    id: 'job_1',
    companyId: 'comp_1',
    companyName: 'TechFlow Solutions',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60',
    title: 'Senior Frontend Developer',
    skills: ['React JS', 'JavaScript', 'Tailwind CSS', 'Redux Toolkit'],
    salary: '$120,000 - $140,000',
    location: 'Remote, USA',
    type: 'Full-time',
    experience: 'Senior (5+ years)',
    description: 'We are seeking a Senior Frontend Developer to lead our core applications team. You will be responsible for building high-performance UI systems, configuring global state, and mentoring junior engineers.',
    requirements: [
      '5+ years of production experience in building web applications.',
      'Strong expertise in React JS, Redux Toolkit, and Tailwind CSS.',
      'Experience optimizing app performance and Web Vitals.',
      'Passion for smooth, dynamic animations using Framer Motion.'
    ],
    status: 'Open',
    postedAt: '2026-06-10T10:00:00.000Z'
  },
  {
    id: 'job_2',
    companyId: 'comp_2',
    companyName: 'Apex Data Corp',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=60',
    title: 'Junior Data Analyst',
    skills: ['Python', 'SQL', 'Data Analysis'],
    salary: '$70,000 - $85,000',
    location: 'New York, NY (Hybrid)',
    type: 'Full-time',
    experience: 'Junior (1-2 years)',
    description: 'Apex Data Corp is hiring a Junior Data Analyst to work with our Business Intelligence division. You will build SQL data models, generate analytics dashboards, and automate report distributions.',
    requirements: [
      'Proficiency in SQL query writing and database schema structures.',
      'Strong familiarity with Python (Pandas, Numpy) and data plotting.',
      'Excellent verbal and written presentation skills.',
      'Degree in Math, Computer Science, or Economics.'
    ],
    status: 'Open',
    postedAt: '2026-06-12T08:30:00.000Z'
  },
  {
    id: 'job_3',
    companyId: 'comp_3',
    companyName: 'PixelForge Studios',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=60',
    title: 'React Native Mobile Developer',
    skills: ['React JS', 'JavaScript', 'OOP'],
    salary: '$110,000 - $130,000',
    location: 'Austin, TX (On-site)',
    type: 'Full-time',
    experience: 'Intermediate (3+ years)',
    description: 'We are expanding our mobile engineering team to support our fast-growing e-commerce clients. You will build and publish native iOS and Android apps using React Native and Redux.',
    requirements: [
      '3+ years React or React Native development experience.',
      'Solid understanding of OOP concepts and mobile design paradigms.',
      'Experience integrating App Store and Google Play Services.',
      'Ability to build smooth transition experiences.'
    ],
    status: 'Open',
    postedAt: '2026-06-13T14:20:00.000Z'
  },
  {
    id: 'job_4',
    companyId: 'comp_1',
    companyName: 'TechFlow Solutions',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60',
    title: 'Python Backend Engineer',
    skills: ['Python', 'SQL', 'OOP', 'Data Structures'],
    salary: '$130,000 - $150,000',
    location: 'Remote (Global)',
    type: 'Full-time',
    experience: 'Senior (5+ years)',
    description: 'Build robust REST and gRPC microservices in Python. You will deploy server clusters on AWS, write highly optimized SQL transactions, and secure data tunnels.',
    requirements: [
      'Deep knowledge of Python (FastAPI/Django) and database optimization.',
      'Strong knowledge of OOP patterns and systems design.',
      'Experience designing token authentication (JWT) and RBAC security systems.'
    ],
    status: 'Open',
    postedAt: '2026-06-14T01:00:00.000Z'
  }
];

const INITIAL_QUIZZES = {
  'HTML': {
    title: 'HTML Essentials',
    questions: [
      { q: 'Which HTML5 element is used to display independent self-contained content?', options: ['<section>', '<article>', '<aside>', '<div>'], correct: 1 },
      { q: 'What is the correct tag for playing audio file in HTML5?', options: ['<sound>', '<audio>', '<music>', '<play>'], correct: 1 },
      { q: 'Which attribute specifies an alternate text for an image, if the image cannot be displayed?', options: ['title', 'alt', 'src', 'longdesc'], correct: 1 }
    ]
  },
  'CSS': {
    title: 'CSS Styling & Layouts',
    questions: [
      { q: 'What does CSS Flexbox stand for in terms of layout direction control?', options: ['Grid system', 'One-dimensional layout model', 'Three-dimensional rendering', 'Static container model'], correct: 1 },
      { q: 'How do you target an element with the ID "container" in CSS?', options: ['.container', '#container', 'container', '*container'], correct: 1 },
      { q: 'Which property is used to change the background color of an element?', options: ['color', 'bg-color', 'background-color', 'element-bg'], correct: 2 }
    ]
  },
  'JavaScript': {
    title: 'JavaScript Deep Dive',
    questions: [
      { q: 'What is the correct syntax for checking equality of both value and type in JS?', options: ['==', '===', 'equals', '!='], correct: 1 },
      { q: 'Which method adds one or more elements to the end of an array and returns the new length?', options: ['pop()', 'push()', 'shift()', 'concat()'], correct: 1 },
      { q: 'What is a closure in JavaScript?', options: ['A function bundled with references to its lexical environment', 'A method to close the browser tab', 'A JSON parser syntax', 'An encryption algorithm'], correct: 0 }
    ]
  },
  'React JS': {
    title: 'React JS Framework Master',
    questions: [
      { q: 'What hook is used to perform side effects in a functional component?', options: ['useState', 'useContext', 'useEffect', 'useMemo'], correct: 2 },
      { q: 'What is the virtual DOM in React?', options: ['A direct reference to Google servers', 'An in-memory representation of the real DOM nodes', 'A plugin for database indexing', 'A dark-mode style generator'], correct: 1 },
      { q: 'How do you pass data from a parent component to a child component?', options: ['State variables', 'Props', 'Context Reducers', 'Import statements'], correct: 1 }
    ]
  },
  'Python': {
    title: 'Python Development Core',
    questions: [
      { q: 'Which collection is ordered, changeable, and allows duplicate members in Python?', options: ['Set', 'Dictionary', 'List', 'Tuple'], correct: 2 },
      { q: 'How do you define a function in Python?', options: ['function myFunc():', 'def myFunc():', 'void myFunc() {}', 'define myFunc():'], correct: 1 },
      { q: 'What does the `self` parameter represent in Python class methods?', options: ['A reserved keyword for local scopes', 'The specific instance of the class object', 'The parent class blueprint', 'An analytical array function'], correct: 1 }
    ]
  },
  'SQL': {
    title: 'SQL Database Management',
    questions: [
      { q: 'Which SQL statement is used to retrieve data from a database?', options: ['GET', 'SELECT', 'EXTRACT', 'OPEN'], correct: 1 },
      { q: 'How do you select all columns from a table named "Customers"?', options: ['SELECT * FROM Customers', 'SELECT Columns FROM Customers', 'SELECT ALL Customers', 'FIND ALL IN Customers'], correct: 0 },
      { q: 'Which clause is used to filter groups returned by the GROUP BY clause?', options: ['WHERE', 'HAVING', 'FILTER', 'ORDER BY'], correct: 1 }
    ]
  },
  'Data Structures': {
    title: 'Data Structures & Algorithms',
    questions: [
      { q: 'What is the average time complexity of searching in a Hash Map?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'], correct: 2 },
      { q: 'Which data structure works on a Last-In, First-Out (LIFO) basis?', options: ['Queue', 'Stack', 'Linked List', 'Binary Search Tree'], correct: 1 },
      { q: 'What algorithm is commonly used to find the shortest path in a weighted graph?', options: ['Binary Search', 'Dijkstra\'s Algorithm', 'Bubble Sort', 'Depth First Search (DFS)'], correct: 1 }
    ]
  },
  'OOP': {
    title: 'Object-Oriented Programming',
    questions: [
      { q: 'What OOP concept is described as wrapping data variables and methods together inside a single unit?', options: ['Polymorphism', 'Inheritance', 'Encapsulation', 'Abstraction'], correct: 2 },
      { q: 'What refers to the ability of a single method name to behave differently depending on the object invoking it?', options: ['Inheritance', 'Abstraction', 'Polymorphism', 'Compilation'], correct: 2 },
      { q: 'Which relationship does Inheritance represent between objects?', options: ['"has-a" relationship', '"is-a" relationship', '"part-of" relationship', '"uses-a" relationship'], correct: 1 }
    ]
  }
};

const INITIAL_MOCK_INTERVIEWS = {
  'Frontend Developer': [
    {
      level: 'Beginner',
      question: 'What is semantic HTML and why should we use it?',
      suggestion: 'Explain that semantic elements clearly describe their meaning in a human- and machine-readable way (e.g., <header>, <main>, <article>). Benefits include accessibility (screen readers), SEO, and code readability.'
    },
    {
      level: 'Intermediate',
      question: 'Explain the difference between call, apply, and bind in JavaScript.',
      suggestion: 'Both call and apply execute a function immediately with a specified `this` context. call takes arguments individually, apply takes arguments as an array. bind returns a new function copy with `this` bound, but does not execute immediately.'
    },
    {
      level: 'Advanced',
      question: 'Explain code splitting and lazy loading in SPA performance optimization.',
      suggestion: 'Discuss bundle sizes, dynamics import (`import()`), React.lazy, and Suspense. Mention that dividing the bundle into smaller chunks decreases the initial load time and optimizes network utilization.'
    }
  ],
  'React Developer': [
    {
      level: 'Beginner',
      question: 'What is the difference between state and props in React?',
      suggestion: 'State is local, mutable data managed internally by the component. Props are read-only, immutable configuration parameters passed into a child component from its parent.'
    },
    {
      level: 'Intermediate',
      question: 'How does React Virtual DOM reconciliation work?',
      suggestion: 'Explain that when state changes, React creates a new virtual DOM tree, diffs it against the previous virtual DOM snapshot, and writes only the exact difference updates to the real DOM (reconciliation/fiber algorithm).'
    },
    {
      level: 'Advanced',
      question: 'When would you use useMemo, useCallback, and React.memo?',
      suggestion: 'React.memo is a HOC that memoizes a component to prevent re-renders when props unchanged. useMemo caches the computed result of an expensive calculation. useCallback caches the reference of a function to prevent child triggers.'
    }
  ],
  'Python Developer': [
    {
      level: 'Beginner',
      question: 'What is PEP 8 and why is it important?',
      suggestion: 'PEP 8 is the official style guide for writing clean Python code. It specifies naming conventions, formatting, indentation, and spacing to increase readability across developers.'
    },
    {
      level: 'Intermediate',
      question: 'Explain generators and the yield keyword in Python.',
      suggestion: 'A generator is a function that returns an iterator yielding items one at a time on demand. Unlike regular functions returning lists, yield suspends state, saving memory for massive datasets.'
    },
    {
      level: 'Advanced',
      question: 'How does Python handle memory management and garbage collection?',
      suggestion: 'Explain Python\'s private heap space managed by the built-in memory manager. Mention reference counting as the primary GC method, coupled with a cyclic garbage collector to resolve self-referencing loops.'
    }
  ],
  'Data Analyst': [
    {
      level: 'Beginner',
      question: 'What is the difference between structured and unstructured data?',
      suggestion: 'Structured data fits into predefined columns/rows like SQL databases. Unstructured data has no predefined format, such as emails, PDF documents, videos, and audio files.'
    },
    {
      level: 'Intermediate',
      question: 'Explain the difference between a Left Join and an Inner Join in SQL.',
      suggestion: 'Inner Join returns records that have matching values in both tables. Left Join returns all records from the left table, plus matched records from the right table. Right values are filled with NULL if no match exists.'
    },
    {
      level: 'Advanced',
      question: 'What is a p-value in statistical analysis?',
      suggestion: 'The p-value measures the probability of obtaining test results at least as extreme as the observed results, assuming the null hypothesis is correct. A p-value less than 0.05 generally rejects the null hypothesis.'
    }
  ],
  'Software Engineer': [
    {
      level: 'Beginner',
      question: 'What is the difference between a class and an object?',
      suggestion: 'A class is a blueprint or template that defines properties and behaviors. An object is an individual instance of that class allocated in memory.'
    },
    {
      level: 'Intermediate',
      question: 'Describe the SOLID principles of software design.',
      suggestion: 'S: Single Responsibility, O: Open/Closed, L: Liskov Substitution, I: Interface Segregation, D: Dependency Inversion. Briefly explain each to demonstrate architectural clean-code practices.'
    },
    {
      level: 'Advanced',
      question: 'Explain the difference between vertical scaling and horizontal scaling of applications.',
      suggestion: 'Vertical scaling (scale up) means adding more power (CPU, RAM) to a single server. Horizontal scaling (scale out) means adding more machine nodes to a resource cluster, utilizing load balancers.'
    }
  ],
  'HR Interview': [
    {
      level: 'Beginner',
      question: 'Tell me about yourself and your background.',
      suggestion: 'Use the Present-Past-Future formula: Introduce your current role/focus, talk about key relevant past achievements, and state why you are excited about this opportunity.'
    },
    {
      level: 'Intermediate',
      question: 'Describe a situation where you had a conflict with a colleague and how you resolved it.',
      suggestion: 'Use the STAR method (Situation, Task, Action, Result). Focus on communication, empathy, compromise, and achieving a professional solution without personal bias.'
    },
    {
      level: 'Advanced',
      question: 'Where do you see yourself in 5 years, and how do you plan to grow?',
      suggestion: 'Express your desire to achieve technical leadership, master architectural systems design, and contribute heavily to product strategy. Focus on alignment with continuous industry growth.'
    }
  ]
};

const INITIAL_EMAIL_TEMPLATES = [
  {
    type: 'Registration',
    subject: 'Welcome to CareerConnect Pro Ultimate!',
    body: `Hello {{name}},\n\nThank you for registering on CareerConnect Pro Ultimate. We are thrilled to help you accelerate your professional growth.\n\nYour account role: {{role}}\n\nNext steps:\n1. Complete your Profile details.\n2. Create an ATS-friendly resume using our built-in Resume Builder.\n3. Take Skill Assessment Quizzes to earn verified certificates.\n\nBest Regards,\nThe CareerConnect Team`
  },
  {
    type: 'Password Reset',
    subject: 'Reset your CareerConnect Password',
    body: `Hello {{name}},\n\nWe received a request to reset the password for your CareerConnect account. Click the link below to configure a new password:\n\nhttps://careerconnect.pro/reset-password?token={{token}}\n\nIf you did not request a password reset, please ignore this email.\n\nBest,\nSecurity Team`
  },
  {
    type: 'Application Submitted',
    subject: 'Application Received: {{jobTitle}} at {{companyName}}',
    body: `Hello {{name}},\n\nYour application for the position of {{jobTitle}} at {{companyName}} has been successfully submitted! The employer is currently reviewing applicant profiles.\n\nYou can track the progress of your application on your Dashboard Application Tracker.\n\nGood luck!\nCareerConnect Alerts`
  },
  {
    type: 'Interview Invitation',
    subject: 'Interview Invitation: {{jobTitle}} at {{companyName}}',
    body: `Dear {{name}},\n\nCongratulations! We would like to invite you for an interview for the {{jobTitle}} position.\n\nDetails:\nDate & Time: {{dateTime}}\nFormat: Online video meeting\n\nPlease reply to confirm your availability or propose an alternative schedule.\n\nBest regards,\nHR Department\n{{companyName}}`
  },
  {
    type: 'Selection',
    subject: 'Job Offer: {{jobTitle}} at {{companyName}}',
    body: `Dear {{name}},\n\nWe are absolutely delighted to offer you the position of {{jobTitle}} with {{companyName}}! \n\nAfter reviewing your applications, portfolio, and interview performance, our team was highly impressed by your skills and experiences. We believe you will make a fantastic addition to our engineering family.\n\nWe will send over the formal offer letter contract in the coming days.\n\nWarmest Congratulations,\n{{companyName}} Recruitment Team`
  }
];

const INITIAL_LEADERBOARD = [
  { name: 'Sarah Connor', skill: 'React JS', score: 100, date: '2026-06-01' },
  { name: 'Alex Mercer', skill: 'Python', score: 100, date: '2026-06-05' },
  { name: 'John Doe', skill: 'JavaScript', score: 95, date: '2026-06-11' },
  { name: 'Elena Rostova', skill: 'SQL', score: 90, date: '2026-06-12' },
  { name: 'Marcus Aurelius', skill: 'OOP', score: 90, date: '2026-06-13' }
];

export const initDb = () => {
  const currentVersion = localStorage.getItem('cc_db_version');
  if (currentVersion !== SEED_VERSION) {
    // Seed new database
    localStorage.clear();
    localStorage.setItem('cc_db_version', SEED_VERSION);
    
    // Seed users
    const defaultUsers = [
      { id: 'usr_seeker', name: 'Muham Seeker', email: 'seeker@careerconnect.com', password: 'password123', role: 'seeker', profile: { fullName: 'Muham Seeker', email: 'seeker@careerconnect.com', skills: ['React JS', 'JavaScript', 'HTML', 'CSS'] } },
      { id: 'usr_employer', name: 'Elite Employer', email: 'employer@careerconnect.com', password: 'password123', role: 'employer', company: INITIAL_COMPANIES[0] },
      { id: 'usr_admin', name: 'Super Admin', email: 'admin@careerconnect.com', password: 'password123', role: 'admin' }
    ];
    localStorage.setItem('cc_users', JSON.stringify(defaultUsers));
    localStorage.setItem('cc_companies', JSON.stringify(INITIAL_COMPANIES));
    localStorage.setItem('cc_jobs', JSON.stringify(INITIAL_JOBS));
    
    // Seed applications
    const defaultApps = [
      {
        id: 'app_1',
        jobId: 'job_1',
        seekerId: 'usr_seeker',
        seekerName: 'Muham Seeker',
        seekerEmail: 'seeker@careerconnect.com',
        jobTitle: 'Senior Frontend Developer',
        companyName: 'TechFlow Solutions',
        status: 'Interview Scheduled',
        appliedDate: '2026-06-11T12:00:00.000Z',
        notes: 'Interview scheduled for June 18th, 2026.'
      },
      {
        id: 'app_2',
        jobId: 'job_2',
        seekerId: 'usr_seeker',
        seekerName: 'Muham Seeker',
        seekerEmail: 'seeker@careerconnect.com',
        jobTitle: 'Junior Data Analyst',
        companyName: 'Apex Data Corp',
        status: 'Applied',
        appliedDate: '2026-06-13T09:15:00.000Z',
        notes: ''
      }
    ];
    localStorage.setItem('cc_applications', JSON.stringify(defaultApps));
    localStorage.setItem('cc_quizzes', JSON.stringify(INITIAL_QUIZZES));
    localStorage.setItem('cc_mock_interviews', JSON.stringify(INITIAL_MOCK_INTERVIEWS));
    localStorage.setItem('cc_email_templates', JSON.stringify(INITIAL_EMAIL_TEMPLATES));
    localStorage.setItem('cc_leaderboard', JSON.stringify(INITIAL_LEADERBOARD));
    
    // Seed notifications
    const defaultNotifications = [
      { id: 'notif_1', userId: 'usr_seeker', type: 'info', title: 'Welcome aboard!', message: 'Complete your profile and start preparing for interviews.', date: '2026-06-14T01:00:00.000Z', read: false },
      { id: 'notif_2', userId: 'usr_seeker', type: 'success', title: 'Interview Invitation', message: 'TechFlow Solutions has updated your application status to Interview Scheduled.', date: '2026-06-14T02:00:00.000Z', read: false }
    ];
    localStorage.setItem('cc_notifications', JSON.stringify(defaultNotifications));
    
    // Seed simulated emails log
    localStorage.setItem('cc_sent_emails', JSON.stringify([]));
  }
};

// Generic CRUD helpers that will match Firebase/Rest API structure
export const mockApi = {
  // DB getter utility
  get: (key) => JSON.parse(localStorage.getItem(key) || '[]'),
  set: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
  
  // Latency Simulator
  delay: (ms = 400) => new Promise(resolve => setTimeout(resolve, ms)),

  // Auth Operations
  auth: {
    login: async (email, password) => {
      await mockApi.delay(500);
      const users = mockApi.get('cc_users');
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!foundUser) throw new Error('Invalid email or password credentials');
      return { id: foundUser.id, name: foundUser.name, email: foundUser.email, role: foundUser.role, profile: foundUser.profile, company: foundUser.company };
    },
    signup: async (name, email, password, role) => {
      await mockApi.delay(600);
      const users = mockApi.get('cc_users');
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email address already exists');
      }
      const newUser = {
        id: `usr_${Date.now()}`,
        name,
        email,
        password,
        role,
        profile: role === 'seeker' ? { fullName: name, email, skills: [], profileCompletion: 15 } : null,
        company: role === 'employer' ? { id: `comp_${Date.now()}`, name: `${name} Corp`, logo: '', industry: '', website: '', description: '', address: '' } : null
      };
      users.push(newUser);
      mockApi.set('cc_users', users);
      
      // Simulate confirmation email
      await mockApi.emails.send('Registration', { name, email, role });

      return { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, profile: newUser.profile, company: newUser.company };
    },
    updateProfile: async (userId, updatedProfile) => {
      await mockApi.delay(400);
      const users = mockApi.get('cc_users');
      const idx = users.findIndex(u => u.id === userId);
      if (idx === -1) throw new Error('User not found');
      
      // Calculate Profile Completion Rate
      let fields = ['fullName', 'email', 'phone', 'address', 'city', 'country', 'qualification', 'experience', 'skills'];
      let filled = 0;
      fields.forEach(f => {
        if (updatedProfile[f] && (Array.isArray(updatedProfile[f]) ? updatedProfile[f].length > 0 : updatedProfile[f] !== '')) {
          filled++;
        }
      });
      if (updatedProfile.resumeUrl || updatedProfile.resumeText) filled++;
      const completion = Math.round((filled / (fields.length + 1)) * 100);
      
      users[idx].profile = { ...users[idx].profile, ...updatedProfile, profileCompletion: completion };
      users[idx].name = updatedProfile.fullName || users[idx].name;
      mockApi.set('cc_users', users);
      return users[idx];
    },
    updateCompanyProfile: async (userId, updatedCompany) => {
      await mockApi.delay(400);
      const users = mockApi.get('cc_users');
      const idx = users.findIndex(u => u.id === userId);
      if (idx === -1) throw new Error('User not found');
      
      const comp = { ...users[idx].company, ...updatedCompany };
      users[idx].company = comp;
      mockApi.set('cc_users', users);

      // Update companies list
      const companies = mockApi.get('cc_companies');
      const cIdx = companies.findIndex(c => c.id === comp.id);
      if (cIdx !== -1) {
        companies[cIdx] = comp;
      } else {
        companies.push(comp);
      }
      mockApi.set('cc_companies', companies);
      
      return users[idx];
    }
  },

  // Jobs Operations
  jobs: {
    list: async () => {
      await mockApi.delay(350);
      return mockApi.get('cc_jobs');
    },
    create: async (jobData) => {
      await mockApi.delay(400);
      const jobs = mockApi.get('cc_jobs');
      const newJob = {
        id: `job_${Date.now()}`,
        ...jobData,
        status: 'Open',
        postedAt: new Date().toISOString()
      };
      jobs.unshift(newJob);
      mockApi.set('cc_jobs', jobs);
      return newJob;
    },
    update: async (jobId, updatedData) => {
      await mockApi.delay(300);
      const jobs = mockApi.get('cc_jobs');
      const idx = jobs.findIndex(j => j.id === jobId);
      if (idx === -1) throw new Error('Job not found');
      jobs[idx] = { ...jobs[idx], ...updatedData };
      mockApi.set('cc_jobs', jobs);
      return jobs[idx];
    },
    delete: async (jobId) => {
      await mockApi.delay(300);
      let jobs = mockApi.get('cc_jobs');
      jobs = jobs.filter(j => j.id !== jobId);
      mockApi.set('cc_jobs', jobs);
      return true;
    }
  },

  // Applications Operations
  applications: {
    list: async () => {
      await mockApi.delay(300);
      return mockApi.get('cc_applications');
    },
    apply: async (jobId, seekerData, resumeData = null) => {
      await mockApi.delay(500);
      const jobs = mockApi.get('cc_jobs');
      const job = jobs.find(j => j.id === jobId);
      if (!job) throw new Error('Job listing not found');

      const apps = mockApi.get('cc_applications');
      // Check duplicate application
      if (apps.some(a => a.jobId === jobId && a.seekerId === seekerData.id)) {
        throw new Error('You have already applied for this job.');
      }

      const newApp = {
        id: `app_${Date.now()}`,
        jobId,
        seekerId: seekerData.id,
        seekerName: seekerData.name,
        seekerEmail: seekerData.email,
        jobTitle: job.title,
        companyName: job.companyName,
        companyId: job.companyId,
        status: 'Applied',
        appliedDate: new Date().toISOString(),
        notes: '',
        resumeData: resumeData || seekerData.profile?.resumeData || null
      };

      apps.unshift(newApp);
      mockApi.set('cc_applications', apps);

      // Add Notification to Seeker
      mockApi.notifications.add(seekerData.id, 'success', 'Application Submitted', `Your application for ${job.title} at ${job.companyName} has been received.`);
      
      // Simulate Email
      await mockApi.emails.send('Application Submitted', {
        name: seekerData.name,
        email: seekerData.email,
        jobTitle: job.title,
        companyName: job.companyName
      });

      return newApp;
    },
    updateStatus: async (appId, status, notes = '', dateTime = '') => {
      await mockApi.delay(400);
      const apps = mockApi.get('cc_applications');
      const idx = apps.findIndex(a => a.id === appId);
      if (idx === -1) throw new Error('Application not found');
      
      apps[idx].status = status;
      if (notes) apps[idx].notes = notes;
      mockApi.set('cc_applications', apps);

      const app = apps[idx];
      
      // Add Notifications and trigger Email Simulations
      if (status === 'Interview Scheduled') {
        mockApi.notifications.add(app.seekerId, 'info', 'Interview Scheduled', `${app.companyName} scheduled an interview for ${app.jobTitle}.`);
        await mockApi.emails.send('Interview Invitation', {
          name: app.seekerName,
          email: app.seekerEmail,
          jobTitle: app.jobTitle,
          companyName: app.companyName,
          dateTime: dateTime || 'June 25th, 2026 at 10:00 AM'
        });
      } else if (status === 'Selected') {
        mockApi.notifications.add(app.seekerId, 'success', 'Congratulations!', `You have been selected for ${app.jobTitle} at ${app.companyName}!`);
        await mockApi.emails.send('Selection', {
          name: app.seekerName,
          email: app.seekerEmail,
          jobTitle: app.jobTitle,
          companyName: app.companyName
        });
      } else if (status === 'Rejected') {
        mockApi.notifications.add(app.seekerId, 'error', 'Application Status Update', `Your application for ${app.jobTitle} at ${app.companyName} was not selected.`);
      } else {
        mockApi.notifications.add(app.seekerId, 'info', 'Application Under Review', `Your application for ${app.jobTitle} is now under review.`);
      }

      return apps[idx];
    }
  },

  // Quizzes & Certification Operations
  quizzes: {
    list: async () => {
      await mockApi.delay(200);
      return mockApi.get('cc_quizzes');
    },
    saveScore: async (seekerName, skill, score) => {
      await mockApi.delay(300);
      const lb = mockApi.get('cc_leaderboard');
      const newScore = {
        name: seekerName,
        skill,
        score,
        date: new Date().toISOString().split('T')[0]
      };
      lb.unshift(newScore);
      // Keep top 15 sorted by score, then date
      lb.sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date));
      mockApi.set('cc_leaderboard', lb.slice(0, 15));

      // Save certificate reference inside seeker certifications
      return newScore;
    },
    getLeaderboard: async () => {
      await mockApi.delay(200);
      return mockApi.get('cc_leaderboard');
    }
  },

  // Notifications Operations
  notifications: {
    list: async (userId) => {
      const all = mockApi.get('cc_notifications');
      return all.filter(n => n.userId === userId).sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    add: (userId, type, title, message) => {
      const all = mockApi.get('cc_notifications');
      all.push({
        id: `notif_${Date.now()}`,
        userId,
        type,
        title,
        message,
        date: new Date().toISOString(),
        read: false
      });
      mockApi.set('cc_notifications', all);
      
      // Dispatch custom event for real-time notification badge
      window.dispatchEvent(new Event('new_notification'));
    },
    markRead: async (notifId) => {
      const all = mockApi.get('cc_notifications');
      const idx = all.findIndex(n => n.id === notifId);
      if (idx !== -1) {
        all[idx].read = true;
        mockApi.set('cc_notifications', all);
      }
      return true;
    },
    markAllRead: async (userId) => {
      const all = mockApi.get('cc_notifications');
      all.forEach(n => {
        if (n.userId === userId) n.read = true;
      });
      mockApi.set('cc_notifications', all);
      return true;
    }
  },

  // Email Simulations Log
  emails: {
    getTemplates: async () => {
      return mockApi.get('cc_email_templates');
    },
    listSent: async () => {
      return mockApi.get('cc_sent_emails');
    },
    send: async (templateType, vars) => {
      const templates = mockApi.get('cc_email_templates');
      const template = templates.find(t => t.type === templateType);
      if (!template) return;

      let subject = template.subject;
      let body = template.body;

      // Replace variables in subjects and body templates
      Object.keys(vars).forEach(k => {
        const regex = new RegExp(`{{${k}}}`, 'g');
        subject = subject.replace(regex, vars[k]);
        body = body.replace(regex, vars[k]);
      });

      // Handle token replacement for Reset Password
      if (templateType === 'Password Reset') {
        const token = Math.random().toString(36).substring(2, 10);
        subject = subject.replace(/{{token}}/g, token);
        body = body.replace(/{{token}}/g, token);
      }

      const sent = mockApi.get('cc_sent_emails');
      const newEmail = {
        id: `email_${Date.now()}`,
        to: vars.email || 'user@example.com',
        type: templateType,
        subject,
        body,
        sentAt: new Date().toISOString()
      };
      sent.unshift(newEmail);
      mockApi.set('cc_sent_emails', sent);

      // Trigger custom notification event to alert email simulator
      window.dispatchEvent(new CustomEvent('email_simulated', { detail: newEmail }));
    }
  },

  // Admin Dashboard stats
  admin: {
    getStats: async () => {
      await mockApi.delay(400);
      const users = mockApi.get('cc_users');
      const jobs = mockApi.get('cc_jobs');
      const apps = mockApi.get('cc_applications');

      const seekers = users.filter(u => u.role === 'seeker');
      const employers = users.filter(u => u.role === 'employer');

      // Fraud detection alerts:
      const fraudAlerts = [];
      seekers.forEach(s => {
        // Simple heuristic fraud detection
        if (s.profile?.fullName && (s.profile.fullName.includes('test') || s.profile.fullName.includes('spam') || s.profile.fullName.match(/\d/))) {
          fraudAlerts.push({ type: 'User', target: s.name, reason: 'Suspicious profile name (contains digits or spam terms)' });
        }
      });
      jobs.forEach(j => {
        if (j.description.includes('earn $5000/day') || j.description.includes('easy money') || j.salary.includes('1000000')) {
          fraudAlerts.push({ type: 'Job', target: `${j.title} at ${j.companyName}`, reason: 'Salary or description indicates potential financial scam' });
        }
      });

      return {
        counters: {
          totalUsers: users.length,
          totalJobs: jobs.length,
          totalApplications: apps.length,
          revenue: `$${apps.length * 150 + employers.length * 250}` // Simulated monetization model
        },
        userGrowth: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          seekers: [15, 30, 45, 60, 80, seekers.length],
          employers: [2, 5, 8, 12, 15, employers.length]
        },
        jobPosting: {
          labels: ['HTML/CSS', 'React JS', 'Python', 'SQL', 'Other'],
          data: [
            jobs.filter(j => j.skills.includes('HTML') || j.skills.includes('CSS')).length,
            jobs.filter(j => j.skills.includes('React JS')).length,
            jobs.filter(j => j.skills.includes('Python')).length,
            jobs.filter(j => j.skills.includes('SQL')).length,
            jobs.filter(j => !['HTML', 'CSS', 'React JS', 'Python', 'SQL'].some(s => j.skills.includes(s))).length
          ]
        },
        hiringRates: {
          applied: apps.length,
          shortlisted: apps.filter(a => a.status === 'Shortlisted' || a.status === 'Interview Scheduled' || a.status === 'Selected').length,
          hired: apps.filter(a => a.status === 'Selected').length
        },
        fraudAlerts
      };
    }
  }
};
