const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Driver = require('./models/Driver');
const connectDB = require('./config/db');

dotenv.config();

const drivers = [
  {
    name: 'Rajesh Kumar',
    phone: '+91-9876543210',
    cabType: 'Economy',
    vehicleNumber: 'DL-01-AB-1234',
    vehicleModel: 'Maruti Swift',
    location: { type: 'Point', coordinates: [77.2090, 28.6139] },
    isAvailable: true,
    rating: 4.7,
  },
  {
    name: 'Amit Sharma',
    phone: '+91-9876543211',
    cabType: 'Premium',
    vehicleNumber: 'DL-02-CD-5678',
    vehicleModel: 'Honda City',
    location: { type: 'Point', coordinates: [77.2150, 28.6200] },
    isAvailable: true,
    rating: 4.9,
  },
  {
    name: 'Suresh Patel',
    phone: '+91-9876543212',
    cabType: 'XL',
    vehicleNumber: 'DL-03-EF-9012',
    vehicleModel: 'Toyota Innova',
    location: { type: 'Point', coordinates: [77.2000, 28.6100] },
    isAvailable: true,
    rating: 4.5,
  },
  {
    name: 'Vikram Singh',
    phone: '+91-9876543213',
    cabType: 'Economy',
    vehicleNumber: 'DL-04-GH-3456',
    vehicleModel: 'Hyundai i20',
    location: { type: 'Point', coordinates: [77.2250, 28.6050] },
    isAvailable: true,
    rating: 4.3,
  },
  {
    name: 'Rahul Verma',
    phone: '+91-9876543214',
    cabType: 'Premium',
    vehicleNumber: 'DL-05-IJ-7890',
    vehicleModel: 'Hyundai Verna',
    location: { type: 'Point', coordinates: [77.1950, 28.6300] },
    isAvailable: true,
    rating: 4.8,
  },
  {
    name: 'Deepak Yadav',
    phone: '+91-9876543215',
    cabType: 'XL',
    vehicleNumber: 'DL-06-KL-1122',
    vehicleModel: 'Mahindra XUV700',
    location: { type: 'Point', coordinates: [77.2300, 28.6180] },
    isAvailable: true,
    rating: 4.6,
  },
  {
    name: 'Manoj Gupta',
    phone: '+91-9876543216',
    cabType: 'Economy',
    vehicleNumber: 'DL-07-MN-3344',
    vehicleModel: 'Maruti Dzire',
    location: { type: 'Point', coordinates: [77.1890, 28.6250] },
    isAvailable: true,
    rating: 4.4,
  },
  {
    name: 'Arjun Nair',
    phone: '+91-9876543217',
    cabType: 'Premium',
    vehicleNumber: 'DL-08-OP-5566',
    vehicleModel: 'Skoda Slavia',
    location: { type: 'Point', coordinates: [77.2100, 28.6080] },
    isAvailable: true,
    rating: 4.9,
  },
  {
    name: 'Prashant Mishra',
    phone: '+91-9876543218',
    cabType: 'Economy',
    vehicleNumber: 'DL-09-QR-7788',
    vehicleModel: 'Tata Tiago',
    location: { type: 'Point', coordinates: [77.2200, 28.6320] },
    isAvailable: true,
    rating: 4.2,
  },
  {
    name: 'Karan Malhotra',
    phone: '+91-9876543219',
    cabType: 'XL',
    vehicleNumber: 'DL-10-ST-9900',
    vehicleModel: 'Kia Carens',
    location: { type: 'Point', coordinates: [77.1980, 28.6170] },
    isAvailable: true,
    rating: 4.7,
  },
  {
    name: 'Nikhil Joshi',
    phone: '+91-9876543220',
    cabType: 'Premium',
    vehicleNumber: 'DL-11-UV-1133',
    vehicleModel: 'Honda Amaze',
    location: { type: 'Point', coordinates: [77.2350, 28.6090] },
    isAvailable: true,
    rating: 4.6,
  },
  {
    name: 'Sanjay Tiwari',
    phone: '+91-9876543221',
    cabType: 'Economy',
    vehicleNumber: 'DL-12-WX-2244',
    vehicleModel: 'Maruti Alto',
    location: { type: 'Point', coordinates: [77.2050, 28.6220] },
    isAvailable: true,
    rating: 4.1,
  },
];

const seedDrivers = async () => {
  try {
    await connectDB();
    await Driver.deleteMany({});
    const created = await Driver.insertMany(drivers);
    console.log(`✅ Seeded ${created.length} drivers successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDrivers();
