/**
 * Seed Initial Donors Data
 * Creates sample donors and columns for testing
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Donor from '../models/Donor.js';
import DynamicColumn from '../models/DynamicColumn.js';
import DonorColumnValue from '../models/DonorColumnValue.js';

dotenv.config();

const seedDonors = async () => {
  try {
    console.log('🌱 Starting to seed donors data...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Donor.deleteMany({});
    await DynamicColumn.deleteMany({});
    await DonorColumnValue.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create sample donors
    const donors = await Donor.insertMany([
      {
        donor_name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        total_donated: 5000,
        total_donations: 3,
        status: 'active'
      },
      {
        donor_name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1987654321',
        total_donated: 10000,
        total_donations: 5,
        status: 'active'
      },
      {
        donor_name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        phone: '+1122334455',
        total_donated: 0,
        total_donations: 0,
        status: 'potential'
      },
      {
        donor_name: 'Alice Williams',
        email: 'alice.williams@example.com',
        phone: '+1555666777',
        total_donated: 15000,
        total_donations: 8,
        status: 'active'
      },
      {
        donor_name: 'Charlie Brown',
        email: 'charlie.brown@example.com',
        phone: '+1999888777',
        total_donated: 2500,
        total_donations: 2,
        status: 'potential'
      }
    ]);
    console.log(`✅ Created ${donors.length} sample donors`);

    // Create dynamic columns
    const columns = await DynamicColumn.insertMany([
      {
        column_key: 'name',
        title: 'Donor',
        type: 'text',
        width: 300,
        order: 0,
        isRequired: true
      },
      {
        column_key: 'status',
        title: 'Status',
        type: 'status',
        width: 150,
        order: 1
      },
      {
        column_key: 'email',
        title: 'Email',
        type: 'email',
        width: 200,
        order: 2
      },
      {
        column_key: 'phone',
        title: 'Phone',
        type: 'phone',
        width: 150,
        order: 3
      },
      {
        column_key: 'donated',
        title: '$ Donated',
        type: 'number',
        width: 120,
        order: 4
      },
      {
        column_key: 'donations',
        title: 'Donations',
        type: 'number',
        width: 120,
        order: 5
      }
    ]);
    console.log(`✅ Created ${columns.length} dynamic columns`);

    // Add some custom field values
    const customValues = [];
    donors.forEach((donor, index) => {
      customValues.push({
        donor_id: donor._id,
        column_key: 'company',
        value: `Company ${index + 1}`
      });
      customValues.push({
        donor_id: donor._id,
        column_key: 'notes',
        value: `Sample notes for ${donor.donor_name}`
      });
    });

    await DonorColumnValue.insertMany(customValues);
    console.log(`✅ Created ${customValues.length} custom field values`);

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Donors: ${donors.length}`);
    console.log(`   - Columns: ${columns.length}`);
    console.log(`   - Custom Values: ${customValues.length}`);
    console.log('\n🚀 You can now test the API at http://localhost:5000/api/donors');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedDonors();
