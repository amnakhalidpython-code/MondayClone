/**
 * Seed Script - Add Sample Donors
 * Run this to populate the database with test data
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Donor from './models/Donor.js';
import DynamicColumn from './models/DynamicColumn.js';
import DonorColumnValue from './models/DonorColumnValue.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const sampleDonors = [
  {
    donor_name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '555-0101',
    status: 'active',
    total_donated: 5000,
    total_donations: 3
  },
  {
    donor_name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '555-0102',
    status: 'active',
    total_donated: 10000,
    total_donations: 5
  },
  {
    donor_name: 'Michael Brown',
    email: 'mbrown@example.com',
    phone: '555-0103',
    status: 'potential',
    total_donated: 0,
    total_donations: 0
  },
  {
    donor_name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '555-0104',
    status: 'active',
    total_donated: 7500,
    total_donations: 4
  },
  {
    donor_name: 'David Wilson',
    email: 'dwilson@example.com',
    phone: '555-0105',
    status: 'potential',
    total_donated: 0,
    total_donations: 0
  }
];

const seedDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing donors...');
    await Donor.deleteMany({});
    await DonorColumnValue.deleteMany({});
    console.log('✅ Cleared existing data');

    // Insert sample donors
    console.log('📝 Inserting sample donors...');
    const insertedDonors = await Donor.insertMany(sampleDonors);
    console.log(`✅ Inserted ${insertedDonors.length} donors`);

    // Display inserted donors
    console.log('\n📊 Sample Donors:');
    insertedDonors.forEach((donor, index) => {
      console.log(`${index + 1}. ${donor.donor_name} - ${donor.email} (${donor.status})`);
    });

    console.log('\n✅ Database seeded successfully!');
    console.log('🚀 You can now view the donors in your frontend');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
