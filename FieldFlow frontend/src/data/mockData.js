const getTodayStr = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const mockUsers = [
  { id: 'user-admin-1', email: 'admin@fieldflow.in', password: 'password', role: 'ADMIN', name: 'Rajesh Kumar' },
  { id: 'user-tech-1', email: 'ramesh@fieldflow.in', password: 'password', role: 'TECHNICIAN', name: 'Ramesh Prasad', technicianId: 'tech-1' },
  { id: 'user-tech-2', email: 'amit@fieldflow.in', password: 'password', role: 'TECHNICIAN', name: 'Amit Singh', technicianId: 'tech-2' },
  { id: 'user-tech-3', email: 'suresh@fieldflow.in', password: 'password', role: 'TECHNICIAN', name: 'Suresh Patil', technicianId: 'tech-3' },
  { id: 'user-tech-4', email: 'karan@fieldflow.in', password: 'password', role: 'TECHNICIAN', name: 'Karan Sharma', technicianId: 'tech-4' },
];

export const mockCustomers = [
  { id: 'cust-1', name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul.sharma@gmail.com', address: 'B-402, Shanti Heights, Sector 15, Vashi, Navi Mumbai, Maharashtra - 400703', serviceCount: 5, lastService: getTodayStr(-10), status: 'Active' },
  { id: 'cust-2', name: 'Amit Patel', phone: '+91 99123 45678', email: 'amit.patel@yahoo.com', address: 'Flat 104, Sunrise Apartments, Bodakdev, Ahmedabad, Gujarat - 380054', serviceCount: 2, lastService: getTodayStr(-5), status: 'Active' },
  { id: 'cust-3', name: 'Neha Gupta', phone: '+91 98234 56789', email: 'neha.gupta@outlook.com', address: 'H.No. 54, Sector 7, Panchkula, Haryana - 134109', serviceCount: 3, lastService: getTodayStr(-24), status: 'Active' },
  { id: 'cust-4', name: 'Vikram Singh', phone: '+91 97112 23344', email: 'vikram.singh@gmail.com', address: 'Plot No. 12, Phase 3, DLF Cyber City, Gurugram, Haryana - 122002', serviceCount: 1, lastService: getTodayStr(-28), status: 'Active' },
  { id: 'cust-5', name: 'Pooja Mehta', phone: '+91 96543 21098', email: 'pooja.mehta@gmail.com', address: '18/2, Benson Town Cross, Benson Town, Bengaluru, Karnataka - 560046', serviceCount: 4, lastService: getTodayStr(-3), status: 'Active' }
];

export const mockTechnicians = [
  { id: 'tech-1', userId: 'user-tech-1', name: 'Ramesh Prasad', specialization: 'AC Repair', phone: '+91 98221 12233', status: 'Available', email: 'ramesh@fieldflow.in' },
  { id: 'tech-2', userId: 'user-tech-2', name: 'Amit Singh', specialization: 'Electrician', phone: '+91 99334 45566', status: 'On Job', email: 'amit@fieldflow.in' },
  { id: 'tech-3', userId: 'user-tech-3', name: 'Suresh Patil', specialization: 'RO Service', phone: '+91 95445 56677', status: 'On Job', email: 'suresh@fieldflow.in' },
  { id: 'tech-4', userId: 'user-tech-4', name: 'Karan Sharma', specialization: 'Plumbing', phone: '+91 91223 34455', status: 'Offline', email: 'karan@fieldflow.in' }
];

export const mockInventory = [
  { id: 'inv-1', partName: 'AC Running Capacitor 45uF', category: 'HVAC Parts', sku: 'CAP-AC-45UF', stock: 15, minStock: 5, price: 800, status: 'In Stock' },
  { id: 'inv-2', partName: 'AC Gas R32 (Per Cylinder)', category: 'Gases', sku: 'GAS-R32-CYL', stock: 3, minStock: 4, price: 2800, status: 'Low Stock' },
  { id: 'inv-3', partName: 'Copper Wire Bundle (1.5 sq mm)', category: 'Electrical', sku: 'WIRE-COP-1.5', stock: 12, minStock: 8, price: 1200, status: 'In Stock' },
  { id: 'inv-4', partName: 'RO Pre-Filter Cartridge', category: 'RO Spares', sku: 'RO-FLT-CART', stock: 24, minStock: 10, price: 350, status: 'In Stock' },
  { id: 'inv-5', partName: 'RO Booster Pump 75 GPD', category: 'RO Spares', sku: 'RO-PUMP-75', stock: 2, minStock: 3, price: 2200, status: 'Low Stock' },
  { id: 'inv-6', partName: 'Brass Bib Tap 0.5 inch', category: 'Plumbing', sku: 'TAP-BRS-0.5', stock: 0, minStock: 2, price: 450, status: 'Critical' },
  { id: 'inv-7', partName: 'CCTV BNC Connector (Pack of 10)', category: 'CCTV Spares', sku: 'CCTV-CON-BNC', stock: 8, minStock: 5, price: 250, status: 'In Stock' }
];

export const mockJobs = [
  {
    id: 'F-1021',
    customerId: 'cust-1',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    serviceType: 'AC Repair',
    problemDescription: 'AC is blowing warm air and making a vibrating noise when the compressor kicks in.',
    priority: 'High',
    address: 'B-402, Shanti Heights, Sector 15, Vashi, Navi Mumbai, Maharashtra - 400703',
    scheduledDate: getTodayStr(0),
    scheduledTime: '11:00 AM',
    technicianId: 'tech-1',
    technicianName: 'Ramesh Prasad',
    status: 'In Progress',
    notes: 'Arrived at the location. Confirmed compressor is starting, but fan speed is low. Suspecting faulty capacitor. Checking capacitor readings.',
    partsUsed: [
      { partId: 'inv-1', partName: 'AC Running Capacitor 45uF', quantity: 1, price: 800 }
    ],
    serviceCharge: 500,
    partsCost: 800,
    totalAmount: 1300,
    paymentStatus: 'Pending',
    paymentMethod: 'UPI',
    beforePhoto: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    afterPhoto: null,
    timeline: [
      { status: 'Pending', time: getTodayStr(0) + 'T09:00:00Z', note: 'Customer request registered' },
      { status: 'Assigned', time: getTodayStr(0) + 'T09:15:00Z', note: 'Job assigned to Ramesh Prasad' },
      { status: 'On The Way', time: getTodayStr(0) + 'T10:30:00Z', note: 'Ramesh departed for customer location' },
      { status: 'Arrived', time: getTodayStr(0) + 'T10:55:00Z', note: 'Ramesh reached location and met the customer' },
      { status: 'In Progress', time: getTodayStr(0) + 'T11:10:00Z', note: 'Diagnostics underway' }
    ]
  },
  {
    id: 'F-1022',
    customerId: 'cust-2',
    customerName: 'Amit Patel',
    customerPhone: '+91 99123 45678',
    serviceType: 'AC Service',
    problemDescription: 'Routine annual wet service of 1.5-ton split AC.',
    priority: 'Normal',
    address: 'Flat 104, Sunrise Apartments, Bodakdev, Ahmedabad, Gujarat - 380054',
    scheduledDate: getTodayStr(0),
    scheduledTime: '03:00 PM',
    technicianId: 'tech-1',
    technicianName: 'Ramesh Prasad',
    status: 'Assigned',
    notes: 'Scheduled for afternoon slot.',
    partsUsed: [],
    serviceCharge: 499,
    partsCost: 0,
    totalAmount: 499,
    paymentStatus: 'Pending',
    paymentMethod: 'Cash',
    beforePhoto: null,
    afterPhoto: null,
    timeline: [
      { status: 'Pending', time: getTodayStr(0) + 'T08:30:00Z', note: 'Routine service booking logged' },
      { status: 'Assigned', time: getTodayStr(0) + 'T09:30:00Z', note: 'Job assigned to Ramesh Prasad' }
    ]
  },
  {
    id: 'F-1023',
    customerId: 'cust-3',
    customerName: 'Neha Gupta',
    customerPhone: '+91 98234 56789',
    serviceType: 'RO Service',
    problemDescription: 'Water flow from purifier is extremely slow, and warning alarm is buzzing.',
    priority: 'High',
    address: 'H.No. 54, Sector 7, Panchkula, Haryana - 134109',
    scheduledDate: getTodayStr(0),
    scheduledTime: '10:00 AM',
    technicianId: 'tech-3',
    technicianName: 'Suresh Patil',
    status: 'Completed',
    notes: 'Filters were completely choked with silt. Replaced sediment and carbon filters. Disinfected tank. Water flow is normal and TDS is now 85 (optimal).',
    partsUsed: [
      { partId: 'inv-4', partName: 'RO Pre-Filter Cartridge', quantity: 2, price: 350 }
    ],
    serviceCharge: 350,
    partsCost: 700,
    totalAmount: 1050,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    beforePhoto: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    afterPhoto: 'https://images.unsplash.com/photo-1613967193442-19cfb7eb0515?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    timeline: [
      { status: 'Pending', time: getTodayStr(-1) + 'T18:00:00Z', note: 'Customer registered slow flow issue' },
      { status: 'Assigned', time: getTodayStr(-1) + 'T18:30:00Z', note: 'Assigned to RO specialist Suresh Patil' },
      { status: 'On The Way', time: getTodayStr(0) + 'T09:45:00Z', note: 'Suresh is heading to location' },
      { status: 'Arrived', time: getTodayStr(0) + 'T10:05:00Z', note: 'Suresh arrived at Neha Guptas residence' },
      { status: 'In Progress', time: getTodayStr(0) + 'T10:15:00Z', note: 'Replacing carbon filter and testing flow rate' },
      { status: 'Completed', time: getTodayStr(0) + 'T11:15:00Z', note: 'Service complete. Purifier water is clean and warning buzzer turned off.' }
    ]
  },
  {
    id: 'F-1024',
    customerId: 'cust-4',
    customerName: 'Vikram Singh',
    customerPhone: '+91 97112 23344',
    serviceType: 'Electrical Repair',
    problemDescription: 'Short circuit occurred in main DB board after heavy rain. Kitchen sockets not working.',
    priority: 'Urgent',
    address: 'Plot No. 12, Phase 3, DLF Cyber City, Gurugram, Haryana - 122002',
    scheduledDate: getTodayStr(0),
    scheduledTime: '01:30 PM',
    technicianId: 'tech-2',
    technicianName: 'Amit Singh',
    status: 'In Progress',
    notes: 'Found water ingress in outer junction box. Replacing copper wire run from DB to main junction box.',
    partsUsed: [
      { partId: 'inv-3', partName: 'Copper Wire Bundle (1.5 sq mm)', quantity: 1, price: 1200 }
    ],
    serviceCharge: 600,
    partsCost: 1200,
    totalAmount: 1800,
    paymentStatus: 'Pending',
    paymentMethod: 'UPI',
    beforePhoto: null,
    afterPhoto: null,
    timeline: [
      { status: 'Pending', time: getTodayStr(0) + 'T12:00:00Z', note: 'Urgent power outage reported' },
      { status: 'Assigned', time: getTodayStr(0) + 'T12:10:00Z', note: 'Assigned to senior electrician Amit Singh' },
      { status: 'On The Way', time: getTodayStr(0) + 'T12:45:00Z', note: 'Amit is on the way' },
      { status: 'Arrived', time: getTodayStr(0) + 'T13:10:00Z', note: 'Amit arrived at DLF Cyber City premises' },
      { status: 'In Progress', time: getTodayStr(0) + 'T13:30:00Z', note: 'DB board opened and insulation testing initiated' }
    ]
  },
  {
    id: 'F-1025',
    customerId: 'cust-5',
    customerName: 'Pooja Mehta',
    customerPhone: '+91 96543 21098',
    serviceType: 'Plumbing',
    problemDescription: 'Bathroom tap is continuously leaking and main control valve is jammed.',
    priority: 'Normal',
    address: '18/2, Benson Town Cross, Benson Town, Bengaluru, Karnataka - 560046',
    scheduledDate: getTodayStr(-1),
    scheduledTime: '04:00 PM',
    technicianId: 'tech-4',
    technicianName: 'Karan Sharma',
    status: 'Completed',
    notes: 'Replaced leaky tap. Unjammed control valve by applying penetrant and changing rubber washer.',
    partsUsed: [],
    serviceCharge: 350,
    partsCost: 0,
    totalAmount: 350,
    paymentStatus: 'Paid',
    paymentMethod: 'Cash',
    beforePhoto: null,
    afterPhoto: null,
    timeline: [
      { status: 'Pending', time: getTodayStr(-1) + 'T14:00:00Z', note: 'Tap leakage booking registered' },
      { status: 'Assigned', time: getTodayStr(-1) + 'T14:30:00Z', note: 'Assigned to Plumber Karan Sharma' },
      { status: 'On The Way', time: getTodayStr(-1) + 'T15:30:00Z', note: 'Karan is on the way' },
      { status: 'Arrived', time: getTodayStr(-1) + 'T15:50:00Z', note: 'Karan arrived' },
      { status: 'In Progress', time: getTodayStr(-1) + 'T16:00:00Z', note: 'Repairing valve washer' },
      { status: 'Completed', time: getTodayStr(-1) + 'T16:45:00Z', note: 'Completed tap replacement' }
    ]
  },
  {
    id: 'F-1020',
    customerId: 'cust-1',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    serviceType: 'AC Service',
    problemDescription: 'Routine pre-summer filter cleaning and general maintenance.',
    priority: 'Low',
    address: 'B-402, Shanti Heights, Sector 15, Vashi, Navi Mumbai, Maharashtra - 400703',
    scheduledDate: getTodayStr(-10),
    scheduledTime: '10:00 AM',
    technicianId: 'tech-1',
    technicianName: 'Ramesh Prasad',
    status: 'Completed',
    notes: 'Completed outdoor jet cleaning and indoor filter washing. Gas pressure checked and found okay.',
    partsUsed: [],
    serviceCharge: 500,
    partsCost: 0,
    totalAmount: 500,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    beforePhoto: null,
    afterPhoto: null,
    timeline: [
      { status: 'Pending', time: getTodayStr(-11) + 'T10:00:00Z', note: 'General service request' },
      { status: 'Assigned', time: getTodayStr(-11) + 'T11:00:00Z', note: 'Assigned to Ramesh' },
      { status: 'On The Way', time: getTodayStr(-10) + 'T09:30:00Z', note: 'On the way' },
      { status: 'Arrived', time: getTodayStr(-10) + 'T09:55:00Z', note: 'Arrived at location' },
      { status: 'In Progress', time: getTodayStr(-10) + 'T10:00:00Z', note: 'Jet wash in progress' },
      { status: 'Completed', time: getTodayStr(-10) + 'T11:00:00Z', note: 'Service completed successfully' }
    ]
  }
];

export const mockPayments = [
  { id: 'pay-1', jobId: 'F-1020', customerName: 'Rahul Sharma', amount: 500, paymentMethod: 'UPI', status: 'Paid', date: getTodayStr(-10) },
  { id: 'pay-2', jobId: 'F-1023', customerName: 'Neha Gupta', amount: 1050, paymentMethod: 'UPI', status: 'Paid', date: getTodayStr(0) },
  { id: 'pay-3', jobId: 'F-1025', customerName: 'Pooja Mehta', amount: 350, paymentMethod: 'Cash', status: 'Paid', date: getTodayStr(-1) },
  { id: 'pay-4', jobId: 'F-1021', customerName: 'Rahul Sharma', amount: 1300, paymentMethod: 'UPI', status: 'Pending', date: getTodayStr(0) },
  { id: 'pay-5', jobId: 'F-1022', customerName: 'Amit Patel', amount: 499, paymentMethod: 'Cash', status: 'Pending', date: getTodayStr(0) },
  { id: 'pay-6', jobId: 'F-1024', customerName: 'Vikram Singh', amount: 1800, paymentMethod: 'UPI', status: 'Pending', date: getTodayStr(0) }
];

export const mockNotifications = [
  { id: 'notif-1', title: 'New Job Created', message: 'Job F-1024 (Electrical Repair) created for Vikram Singh.', time: getTodayStr(0) + 'T12:00:00Z', read: false },
  { id: 'notif-2', title: 'Technician Assigned', message: 'Suresh Patil assigned to Job F-1023 (RO Service).', time: getTodayStr(-1) + 'T18:30:00Z', read: true },
  { id: 'notif-3', title: 'Low Stock Alert', message: 'RO Booster Pump 75 GPD is low on stock (2 remaining).', time: getTodayStr(0) + 'T08:00:00Z', read: false },
  { id: 'notif-4', title: 'Job Completed', message: 'Job F-1025 (Plumbing) completed by Karan Sharma.', time: getTodayStr(-1) + 'T16:45:00Z', read: true }
];
