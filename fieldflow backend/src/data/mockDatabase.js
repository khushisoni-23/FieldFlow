const bcrypt = require('bcryptjs');

// Helper to hash password synchronously for seeding
const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const users = [
  {
    id: 'user-admin',
    name: 'Khushi Soni (Admin)',
    email: 'admin@fieldflow.com',
    password: hashPassword('adminpassword'),
    role: 'ADMIN'
  },
  {
    id: 'user-tech-201',
    name: 'Ramesh Kumar',
    email: 'ramesh.repair@fieldflow.com',
    password: hashPassword('techpassword'),
    role: 'TECHNICIAN'
  },
  {
    id: 'user-tech-202',
    name: 'Mohit Sharma',
    email: 'mohit.electric@fieldflow.com',
    password: hashPassword('techpassword'),
    role: 'TECHNICIAN'
  },
  {
    id: 'user-tech-203',
    name: 'Ankit Verma',
    email: 'ankit.plumb@fieldflow.com',
    password: hashPassword('techpassword'),
    role: 'TECHNICIAN'
  }
];

const customers = [
  {
    id: 'CUST-101',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@email.com',
    address: 'B-402, Shanti Kunj, Sector 56',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    notes: 'Requires weekend service only. Speaks Hindi and English.',
    createdAt: '2026-01-15T10:00:00.000Z',
    status: 'Active',
    serviceCount: 5,
    lastService: '2026-08-20'
  },
  {
    id: 'CUST-102',
    name: 'Priya Mehta',
    phone: '+91 91234 56789',
    email: 'priya.mehta@email.com',
    address: 'Flat 12A, Sterling Heights, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    notes: 'Prefer morning appointments between 9 AM and 12 PM.',
    createdAt: '2026-02-10T14:30:00.000Z',
    status: 'Active',
    serviceCount: 3,
    lastService: '2026-08-15'
  },
  {
    id: 'CUST-103',
    name: 'Arjun Singh',
    phone: '+91 88888 77777',
    email: 'arjun.singh@email.com',
    address: 'H.No 145, Sector 15A',
    city: 'Chandigarh',
    state: 'Punjab',
    pincode: '160015',
    notes: 'Call 30 mins before arrival.',
    createdAt: '2026-03-05T09:15:00.000Z',
    status: 'Active',
    serviceCount: 12,
    lastService: '2026-08-28'
  },
  {
    id: 'CUST-104',
    name: 'Neha Jain',
    phone: '+91 99991 11122',
    email: 'neha.jain@email.com',
    address: 'Villa 89, Palm Meadows, Whitefield',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560066',
    notes: 'AC unit under extended warranty.',
    createdAt: '2026-04-20T11:45:00.000Z',
    status: 'Active',
    serviceCount: 2,
    lastService: 'N/A'
  }
];

const technicians = [
  {
    id: 'TECH-201',
    userId: 'user-tech-201',
    name: 'Ramesh Kumar',
    phone: '+91 95550 12345',
    email: 'ramesh.repair@fieldflow.com',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=150&h=150&q=80',
    specialization: 'AC Repair',
    skills: ['AC Repair', 'AC Service', 'Appliance Repair'],
    status: 'Available', // Available, On Job / Busy, Offline
    rating: 4.8,
    assignedJobsCount: 1,
    completedJobsCount: 24,
    workload: 20
  },
  {
    id: 'TECH-202',
    userId: 'user-tech-202',
    name: 'Mohit Sharma',
    phone: '+91 95550 54321',
    email: 'mohit.electric@fieldflow.com',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&h=150&q=80',
    specialization: 'Electrical',
    skills: ['Electrical', 'CCTV Installation', 'Appliance Repair'],
    status: 'Offline', // Changed from Busy to match Technician status enum (Offline/Available/On Job)
    rating: 4.6,
    assignedJobsCount: 2,
    completedJobsCount: 18,
    workload: 65
  },
  {
    id: 'TECH-203',
    userId: 'user-tech-203',
    name: 'Ankit Verma',
    phone: '+91 95550 98765',
    email: 'ankit.plumb@fieldflow.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    specialization: 'Plumbing',
    skills: ['Plumbing', 'RO Repair'],
    status: 'Available',
    rating: 4.9,
    assignedJobsCount: 0,
    completedJobsCount: 32,
    workload: 0
  }
];

const inventory = [
  {
    id: 'PART-301',
    partName: 'Compressor Capacitor 45uF',
    sku: 'CAP-AC-45UF',
    category: 'AC Spare Parts',
    stock: 14,
    minStock: 5,
    price: 850,
    status: 'In Stock'
  },
  {
    id: 'PART-302',
    partName: 'RO Filter Membrane',
    sku: 'FILT-RO-MEM',
    category: 'Water Purifier Parts',
    stock: 3,
    minStock: 8,
    price: 1800,
    status: 'Low Stock'
  },
  {
    id: 'PART-303',
    partName: 'AC Remote Controller Universal',
    sku: 'REM-AC-UNIV',
    category: 'Accessories',
    stock: 25,
    minStock: 10,
    price: 450,
    status: 'In Stock'
  },
  {
    id: 'PART-304',
    partName: 'Copper Pipe 1/4 inch (per meter)',
    sku: 'PIPE-COP-25',
    category: 'AC Spare Parts',
    stock: 45,
    minStock: 15,
    price: 320,
    status: 'In Stock'
  },
  {
    id: 'PART-305',
    partName: 'Brass Tap Spindle 1/2 inch',
    sku: 'TAP-SPIN-05',
    category: 'Plumbing Parts',
    stock: 0,
    minStock: 10,
    price: 180,
    status: 'Critical' // Re-computed: stock = 0 is Critical, stock <= minStock is Low Stock
  }
];

const jobs = [
  {
    id: 'JOB-5001',
    customerId: 'CUST-101',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    serviceType: 'AC Service',
    problemDescription: 'General seasonal split AC cleaning and filter washing.',
    address: 'B-402, Shanti Kunj, Sector 56, Noida, Uttar Pradesh 201301',
    priority: 'Medium',
    scheduledDate: '2026-08-30',
    scheduledTime: '11:00 AM',
    technicianId: 'TECH-201',
    technicianName: 'Ramesh Kumar',
    serviceCharge: 1200,
    partsCost: 0,
    totalAmount: 1200,
    status: 'Assigned',
    paymentStatus: 'Pending',
    paymentMethod: 'UPI',
    notes: 'Please clean both outdoor and indoor units.',
    partsUsed: [],
    beforePhoto: null,
    afterPhoto: null,
    timeline: [
      { status: 'Pending', time: '2026-08-28T09:00:00.000Z', note: 'Job Created' },
      { status: 'Assigned', time: '2026-08-28T10:30:00.000Z', note: 'Technician Ramesh Kumar Assigned' }
    ]
  },
  {
    id: 'JOB-5002',
    customerId: 'CUST-102',
    customerName: 'Priya Mehta',
    customerPhone: '+91 91234 56789',
    serviceType: 'RO Repair',
    problemDescription: 'Water taste is bitter. TDS reading might be high or membrane choked.',
    address: 'Flat 12A, Sterling Heights, Bandra West, Mumbai, Maharashtra 400050',
    priority: 'High',
    scheduledDate: '2026-08-29',
    scheduledTime: '03:30 PM',
    technicianId: 'TECH-203',
    technicianName: 'Ankit Verma',
    serviceCharge: 2500,
    partsCost: 0,
    totalAmount: 2500,
    status: 'In Progress',
    paymentStatus: 'Pending',
    paymentMethod: 'UPI',
    notes: 'Replace filters if needed.',
    partsUsed: [],
    beforePhoto: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80',
    afterPhoto: null,
    timeline: [
      { status: 'Pending', time: '2026-08-28T11:15:00.000Z', note: 'Job Created' },
      { status: 'Assigned', time: '2026-08-28T11:30:00.000Z', note: 'Technician Ankit Verma Assigned' },
      { status: 'On The Way', time: '2026-08-29T15:00:00.000Z', note: 'Technician marked On The Way' },
      { status: 'Arrived', time: '2026-08-29T15:20:00.000Z', note: 'Technician Arrived' },
      { status: 'In Progress', time: '2026-08-29T15:30:00.000Z', note: 'Service Started' }
    ]
  },
  {
    id: 'JOB-5003',
    customerId: 'CUST-103',
    customerName: 'Arjun Singh',
    customerPhone: '+91 88888 77777',
    serviceType: 'Electrical Service',
    problemDescription: 'Main distribution box MCB keeps tripping when AC is turned on.',
    address: 'H.No 145, Sector 15A, Chandigarh, Punjab 160015',
    priority: 'Urgent',
    scheduledDate: '2026-08-28',
    scheduledTime: '10:00 AM',
    technicianId: 'TECH-202',
    technicianName: 'Mohit Sharma',
    serviceCharge: 1000,
    partsCost: 850,
    totalAmount: 1850,
    status: 'Completed', // PaymentStatus is Paid, JobStatus completes as Completed
    paymentStatus: 'Paid',
    paymentMethod: 'Cash',
    notes: 'Main load wiring has a short circuit. Solved successfully.',
    partsUsed: [
      { partId: 'PART-301', partName: 'Compressor Capacitor 45uF', quantity: 1, price: 850 }
    ],
    beforePhoto: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80',
    afterPhoto: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=500&q=80',
    timeline: [
      { status: 'Pending', time: '2026-08-27T18:00:00.000Z', note: 'Job Created' },
      { status: 'Assigned', time: '2026-08-27T18:05:00.000Z', note: 'Technician Mohit Sharma Assigned' },
      { status: 'Arrived', time: '2026-08-28T09:45:00.000Z', note: 'Technician Arrived' },
      { status: 'Completed', time: '2026-08-28T10:45:00.000Z', note: 'Service Completed' }
    ]
  },
  {
    id: 'JOB-5004',
    customerId: 'CUST-104',
    customerName: 'Neha Jain',
    customerPhone: '+91 99991 11122',
    serviceType: 'AC Repair',
    problemDescription: 'AC is blowing warm air. Gas leak suspected.',
    address: 'Villa 89, Palm Meadows, Whitefield, Bengaluru, Karnataka 560066',
    priority: 'Urgent',
    scheduledDate: '2026-08-31',
    scheduledTime: '02:00 PM',
    technicianId: null,
    technicianName: 'Unassigned',
    serviceCharge: 3500,
    partsCost: 0,
    totalAmount: 3500,
    status: 'Pending',
    paymentStatus: 'Pending',
    paymentMethod: 'UPI',
    notes: 'Warranty card is in the drawer. Check gas pressure.',
    partsUsed: [],
    beforePhoto: null,
    afterPhoto: null,
    timeline: [
      { status: 'Pending', time: '2026-08-29T12:00:00.000Z', note: 'Job Created' }
    ]
  }
];

const payments = [
  {
    id: 'PAY-8001',
    jobId: 'JOB-5003',
    customerName: 'Arjun Singh',
    amount: 1850,
    paymentMethod: 'Cash',
    status: 'Paid',
    date: '2026-08-28'
  }
];

const notifications = [
  {
    id: 'NOTIF-901',
    title: 'New Job Created',
    message: 'New job JOB-5004 AC Repair created for Neha Jain.',
    time: '2026-08-29T12:00:00.000Z',
    read: false
  },
  {
    id: 'NOTIF-902',
    title: 'Payment Received',
    message: 'Payment of ₹1,850 received for JOB-5003 from Arjun Singh.',
    time: '2026-08-28T10:50:00.000Z',
    read: true
  },
  {
    id: 'NOTIF-903',
    title: 'Job Completed',
    message: 'Technician Mohit Sharma completed JOB-5003 (Electrical Service).',
    time: '2026-08-28T10:45:00.000Z',
    read: true
  }
];

module.exports = {
  users,
  customers,
  technicians,
  inventory,
  jobs,
  payments,
  notifications
};
