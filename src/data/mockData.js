// Mock database seed data for localStorage initialization

export const ROLES = {
  ADMIN: 1,
  FACULTY: 2,
  STUDENT: 3,
};

export const STATUSES = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

export const PRIORITIES = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const initialRoles = [
  { RoleId: ROLES.ADMIN, RoleName: 'Admin' },
  { RoleId: ROLES.FACULTY, RoleName: 'Faculty' },
  { RoleId: ROLES.STUDENT, RoleName: 'Student' },
];

export const initialStatuses = [
  { StatusId: 1, StatusName: STATUSES.PENDING },
  { StatusId: 2, StatusName: STATUSES.IN_PROGRESS },
  { StatusId: 3, StatusName: STATUSES.COMPLETED },
];

export const initialPriorities = [
  { PriorityId: 1, PriorityName: PRIORITIES.LOW },
  { PriorityId: 2, PriorityName: PRIORITIES.MEDIUM },
  { PriorityId: 3, PriorityName: PRIORITIES.HIGH },
];

export const initialUsers = [
  // Admins
  {
    UserId: 1,
    FullName: 'Dr. Sarah Jenkins',
    Email: 'sarah.admin@spms.edu',
    Password: 'password123',
    MobileNumber: '+1 (555) 019-2834',
    ProfilePicturePath: null,
    IsActive: true,
    RoleId: ROLES.ADMIN,
  },
  {
    UserId: 2,
    FullName: 'James Carter',
    Email: 'james.admin@spms.edu',
    Password: 'password123',
    MobileNumber: '+1 (555) 014-9988',
    ProfilePicturePath: null,
    IsActive: true,
    RoleId: ROLES.ADMIN,
  },
  // Faculty
  {
    UserId: 3,
    FullName: 'Prof. Alan Turing',
    Email: 'alan.turing@spms.edu',
    Password: 'password123',
    MobileNumber: '+1 (555) 012-3456',
    ProfilePicturePath: null,
    IsActive: true,
    RoleId: ROLES.FACULTY,
  },
  {
    UserId: 4,
    FullName: 'Dr. Grace Hopper',
    Email: 'grace.hopper@spms.edu',
    Password: 'password123',
    MobileNumber: '+1 (555) 013-4567',
    ProfilePicturePath: null,
    IsActive: true,
    RoleId: ROLES.FACULTY,
  },
  {
    UserId: 5,
    FullName: 'Dr. Richard Feynman',
    Email: 'richard.feynman@spms.edu',
    Password: 'password123',
    MobileNumber: '+1 (555) 014-5678',
    ProfilePicturePath: null,
    IsActive: true,
    RoleId: ROLES.FACULTY,
  },
  // Students
  {
    UserId: 6,
    FullName: 'Alex Rivera',
    Email: 'alex.rivera@spms.edu',
    Password: 'password123',
    MobileNumber: '+1 (555) 015-6789',
    ProfilePicturePath: null,
    IsActive: true,
    RoleId: ROLES.STUDENT,
  },
  {
    UserId: 7,
    FullName: 'Emily Watson',
    Email: 'emily.watson@spms.edu',
    Password: 'password123',
    MobileNumber: '+1 (555) 016-7890',
    ProfilePicturePath: null,
    IsActive: true,
    RoleId: ROLES.STUDENT,
  },
  {
    UserId: 8,
    FullName: 'Michael Chang',
    Email: 'michael.chang@spms.edu',
    Password: 'password123',
    MobileNumber: '+1 (555) 017-8901',
    ProfilePicturePath: null,
    IsActive: true,
    RoleId: ROLES.STUDENT,
  },
  {
    UserId: 9,
    FullName: 'Sophia Patel',
    Email: 'sophia.patel@spms.edu',
    Password: 'password123',
    MobileNumber: '+1 (555) 018-9012',
    ProfilePicturePath: null,
    IsActive: true,
    RoleId: ROLES.STUDENT,
  },
  {
    UserId: 10,
    FullName: 'Liam O\'Connor',
    Email: 'liam.oconnor@spms.edu',
    Password: 'password123',
    MobileNumber: '+1 (555) 019-0123',
    ProfilePicturePath: null,
    IsActive: true,
    RoleId: ROLES.STUDENT,
  },
];

export const initialProjects = [
  {
    ProjectId: 1,
    ProjectTitle: 'AI-Powered Smart Campus Navigation',
    Description: 'Development of an AR-based campus navigation system using machine learning for path optimization and location recognition.',
    StudentId: 6, // Alex Rivera
    FacultyId: 3, // Prof. Alan Turing
    StartDate: '2026-06-01',
    EndDate: '2026-12-15',
    Status: STATUSES.IN_PROGRESS,
    ProgressPercentage: 65,
  },
  {
    ProjectId: 2,
    ProjectTitle: 'Quantum Cryptography Simulation Suite',
    Description: 'An interactive simulator showing key distribution protocols (BB84) and demonstrating vulnerabilities against eavesdropping attempts.',
    StudentId: 7, // Emily Watson
    FacultyId: 3, // Prof. Alan Turing
    StartDate: '2026-05-15',
    EndDate: '2026-11-30',
    Status: STATUSES.IN_PROGRESS,
    ProgressPercentage: 40,
  },
  {
    ProjectId: 3,
    ProjectTitle: 'Automated Code Vulnerability Scanner',
    Description: 'A static analysis tool that parses source code ASTs to identify security risks such as SQL injection, XSS, and broken authentication.',
    StudentId: 8, // Michael Chang
    FacultyId: 4, // Dr. Grace Hopper
    StartDate: '2026-04-10',
    EndDate: '2026-10-20',
    Status: STATUSES.IN_PROGRESS,
    ProgressPercentage: 80,
  },
  {
    ProjectId: 4,
    ProjectTitle: 'IoT Environmental Monitoring Grid',
    Description: 'A wireless sensor network deployed around the college to capture and visualize air quality, noise levels, and temperature real-time data.',
    StudentId: 9, // Sophia Patel
    FacultyId: 5, // Dr. Richard Feynman
    StartDate: '2026-07-01',
    EndDate: '2026-12-01',
    Status: STATUSES.PENDING,
    ProgressPercentage: 0,
  },
  {
    ProjectId: 5,
    ProjectTitle: 'Distributed Blockchain Voting Portal',
    Description: 'A secure, anonymous, and auditable student council voting system using decentralized smart contracts.',
    StudentId: 10, // Liam O'Connor
    FacultyId: 4, // Dr. Grace Hopper
    StartDate: '2026-03-01',
    EndDate: '2026-06-30',
    Status: STATUSES.COMPLETED,
    ProgressPercentage: 100,
  },
];

export const initialTasks = [
  // Project 1 Tasks (AI Navigation)
  {
    TaskId: 1,
    ProjectId: 1,
    TaskTitle: 'Requirement Analysis & Modeling',
    TaskDescription: 'Define requirements, map constraints, and model the pathfinding algorithm logic.',
    Status: STATUSES.COMPLETED,
    Priority: PRIORITIES.HIGH,
    AssignedScore: 10,
    EarnedScore: 10,
    StartDate: '2026-06-01',
    DueDate: '2026-06-15',
    CompletedDate: '2026-06-14',
  },
  {
    TaskId: 2,
    ProjectId: 1,
    TaskTitle: 'AR Engine Selection & Integration',
    TaskDescription: 'Research and evaluate Unity vs. WebXR for the AR rendering pipeline.',
    Status: STATUSES.COMPLETED,
    Priority: PRIORITIES.MEDIUM,
    AssignedScore: 15,
    EarnedScore: 14,
    StartDate: '2026-06-16',
    DueDate: '2026-07-10',
    CompletedDate: '2026-07-08',
  },
  {
    TaskId: 3,
    ProjectId: 1,
    TaskTitle: 'Machine Learning Pathfinding Algorithm',
    TaskDescription: 'Implement A* algorithm and train model on campus geometry mappings.',
    Status: STATUSES.IN_PROGRESS,
    Priority: PRIORITIES.HIGH,
    AssignedScore: 30,
    EarnedScore: 0,
    StartDate: '2026-07-11',
    DueDate: '2026-08-30',
    CompletedDate: null,
  },
  {
    TaskId: 4,
    ProjectId: 1,
    TaskTitle: 'User Interface Construction',
    TaskDescription: 'Design user-friendly interactive screens and map overlays.',
    Status: STATUSES.PENDING,
    Priority: PRIORITIES.LOW,
    AssignedScore: 20,
    EarnedScore: 0,
    StartDate: '2026-09-01',
    DueDate: '2026-10-15',
    CompletedDate: null,
  },

  // Project 2 Tasks (Quantum Cryptography)
  {
    TaskId: 5,
    ProjectId: 2,
    TaskTitle: 'Qubit Mathematical Framework Coding',
    TaskDescription: 'Create complex vector spaces representing qubit states and polarization matrices.',
    Status: STATUSES.COMPLETED,
    Priority: PRIORITIES.HIGH,
    AssignedScore: 20,
    EarnedScore: 18.5,
    StartDate: '2026-05-15',
    DueDate: '2026-06-15',
    CompletedDate: '2026-06-15',
  },
  {
    TaskId: 6,
    ProjectId: 2,
    TaskTitle: 'Simulation of BB84 Protocol Steps',
    TaskDescription: 'Code states for transmitter (Alice) and receiver (Bob) with base choices.',
    Status: STATUSES.IN_PROGRESS,
    Priority: PRIORITIES.HIGH,
    AssignedScore: 30,
    EarnedScore: 0,
    StartDate: '2026-06-16',
    DueDate: '2026-08-15',
    CompletedDate: null,
  },
  {
    TaskId: 7,
    ProjectId: 2,
    TaskTitle: 'Eavesdropping (Eve) Module Integration',
    TaskDescription: 'Add interception methods to demonstrate noise injection and key mismatch rates.',
    Status: STATUSES.PENDING,
    Priority: PRIORITIES.MEDIUM,
    AssignedScore: 25,
    EarnedScore: 0,
    StartDate: '2026-08-16',
    DueDate: '2026-10-01',
    CompletedDate: null,
  },

  // Project 3 Tasks (Vulnerability Scanner)
  {
    TaskId: 8,
    ProjectId: 3,
    TaskTitle: 'AST Parser Configuration',
    TaskDescription: 'Integrate Esprima parser to output valid abstract syntax trees for JS/TS code.',
    Status: STATUSES.COMPLETED,
    Priority: PRIORITIES.HIGH,
    AssignedScore: 25,
    EarnedScore: 24,
    StartDate: '2026-04-10',
    DueDate: '2026-05-10',
    CompletedDate: '2026-05-09',
  },
  {
    TaskId: 9,
    ProjectId: 3,
    TaskTitle: 'SQL Injection AST Detection Rules',
    TaskDescription: 'Define queries traversal patterns identifying unsanitized template literal arguments.',
    Status: STATUSES.COMPLETED,
    Priority: PRIORITIES.HIGH,
    AssignedScore: 25,
    EarnedScore: 25,
    StartDate: '2026-05-11',
    DueDate: '2026-06-20',
    CompletedDate: '2026-06-18',
  },
  {
    TaskId: 10,
    ProjectId: 3,
    TaskTitle: 'XSS Detection Logic & Rules',
    TaskDescription: 'Define rules for tracking innerHTML and dangerouslySetInnerHTML properties.',
    Status: STATUSES.IN_PROGRESS,
    Priority: PRIORITIES.MEDIUM,
    AssignedScore: 20,
    EarnedScore: 0,
    StartDate: '2026-06-21',
    DueDate: '2026-08-01',
    CompletedDate: null,
  },

  // Project 4 Tasks (IoT Environmental Grid)
  {
    TaskId: 11,
    ProjectId: 4,
    TaskTitle: 'Sensor Calibration & Calibration Tests',
    TaskDescription: 'Hardware testing of PM2.5, DHT22 and sound sensors for precision offsets.',
    Status: STATUSES.PENDING,
    Priority: PRIORITIES.MEDIUM,
    AssignedScore: 30,
    EarnedScore: 0,
    StartDate: '2026-07-01',
    DueDate: '2026-08-15',
    CompletedDate: null,
  },

  // Project 5 Tasks (Blockchain Voting - Completed)
  {
    TaskId: 12,
    ProjectId: 5,
    TaskTitle: 'Smart Contract Design & Verification',
    TaskDescription: 'Draft contracts in Solidity verifying double voting prevention.',
    Status: STATUSES.COMPLETED,
    Priority: PRIORITIES.HIGH,
    AssignedScore: 40,
    EarnedScore: 39.5,
    StartDate: '2026-03-01',
    DueDate: '2026-04-15',
    CompletedDate: '2026-04-14',
  },
  {
    TaskId: 13,
    ProjectId: 5,
    TaskTitle: 'Web3 Login Integration',
    TaskDescription: 'Integrate Metamask signature-based user authentication checks.',
    Status: STATUSES.COMPLETED,
    Priority: PRIORITIES.MEDIUM,
    AssignedScore: 30,
    EarnedScore: 28,
    StartDate: '2026-04-16',
    DueDate: '2026-05-25',
    CompletedDate: '2026-05-24',
  },
  {
    TaskId: 14,
    ProjectId: 5,
    TaskTitle: 'Frontend Auditing Interface',
    TaskDescription: 'Develop real-time public ledger charts scanning smart contract logs.',
    Status: STATUSES.COMPLETED,
    Priority: PRIORITIES.LOW,
    AssignedScore: 30,
    EarnedScore: 30,
    StartDate: '2026-05-26',
    DueDate: '2026-06-30',
    CompletedDate: '2026-06-29',
  },
];
