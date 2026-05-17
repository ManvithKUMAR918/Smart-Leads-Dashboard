import mongoose from 'mongoose';
import { User } from '../models/User.model';
import { Lead } from '../models/Lead.model';
import { UserRole, LeadStatus, LeadSource } from '../types';
import { env } from '../config/env';

const seedData = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@smartleads.com',
      password: 'admin123',
      role: UserRole.ADMIN,
    });

    const salesUser = await User.create({
      name: 'Sales User',
      email: 'sales@smartleads.com',
      password: 'sales123',
      role: UserRole.SALES,
    });

    console.log('👤 Created users');

    // Create sample leads
    const sampleLeads = [
      { name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', status: LeadStatus.NEW, source: LeadSource.WEBSITE, createdBy: adminUser._id },
      { name: 'Priya Patel', email: 'priya.patel@outlook.com', status: LeadStatus.CONTACTED, source: LeadSource.INSTAGRAM, createdBy: salesUser._id },
      { name: 'Amit Kumar', email: 'amit.kumar@yahoo.com', status: LeadStatus.QUALIFIED, source: LeadSource.REFERRAL, createdBy: adminUser._id },
      { name: 'Sneha Gupta', email: 'sneha.gupta@gmail.com', status: LeadStatus.NEW, source: LeadSource.INSTAGRAM, createdBy: salesUser._id },
      { name: 'Vikram Singh', email: 'vikram.singh@hotmail.com', status: LeadStatus.LOST, source: LeadSource.WEBSITE, createdBy: adminUser._id },
      { name: 'Ananya Reddy', email: 'ananya.reddy@gmail.com', status: LeadStatus.CONTACTED, source: LeadSource.REFERRAL, createdBy: salesUser._id },
      { name: 'Rohan Mehta', email: 'rohan.mehta@gmail.com', status: LeadStatus.QUALIFIED, source: LeadSource.WEBSITE, createdBy: adminUser._id },
      { name: 'Kavita Joshi', email: 'kavita.joshi@outlook.com', status: LeadStatus.NEW, source: LeadSource.INSTAGRAM, createdBy: salesUser._id },
      { name: 'Deepak Verma', email: 'deepak.verma@gmail.com', status: LeadStatus.CONTACTED, source: LeadSource.WEBSITE, createdBy: adminUser._id },
      { name: 'Meera Nair', email: 'meera.nair@yahoo.com', status: LeadStatus.QUALIFIED, source: LeadSource.REFERRAL, createdBy: salesUser._id },
      { name: 'Arjun Das', email: 'arjun.das@gmail.com', status: LeadStatus.NEW, source: LeadSource.WEBSITE, createdBy: adminUser._id },
      { name: 'Pooja Iyer', email: 'pooja.iyer@hotmail.com', status: LeadStatus.LOST, source: LeadSource.INSTAGRAM, createdBy: salesUser._id },
      { name: 'Sanjay Tiwari', email: 'sanjay.tiwari@gmail.com', status: LeadStatus.CONTACTED, source: LeadSource.REFERRAL, createdBy: adminUser._id },
      { name: 'Nisha Agarwal', email: 'nisha.agarwal@outlook.com', status: LeadStatus.NEW, source: LeadSource.WEBSITE, createdBy: salesUser._id },
      { name: 'Karthik Menon', email: 'karthik.menon@gmail.com', status: LeadStatus.QUALIFIED, source: LeadSource.INSTAGRAM, createdBy: adminUser._id },
      { name: 'Swati Pandey', email: 'swati.pandey@yahoo.com', status: LeadStatus.CONTACTED, source: LeadSource.WEBSITE, createdBy: salesUser._id },
      { name: 'Manish Saxena', email: 'manish.saxena@gmail.com', status: LeadStatus.LOST, source: LeadSource.REFERRAL, createdBy: adminUser._id },
      { name: 'Divya Rao', email: 'divya.rao@hotmail.com', status: LeadStatus.NEW, source: LeadSource.INSTAGRAM, createdBy: salesUser._id },
      { name: 'Rajesh Bhat', email: 'rajesh.bhat@gmail.com', status: LeadStatus.QUALIFIED, source: LeadSource.WEBSITE, createdBy: adminUser._id },
      { name: 'Tanvi Shah', email: 'tanvi.shah@outlook.com', status: LeadStatus.CONTACTED, source: LeadSource.REFERRAL, createdBy: salesUser._id },
    ];

    await Lead.insertMany(sampleLeads);
    console.log(`📊 Created ${sampleLeads.length} sample leads`);

    console.log('\n═══════════════════════════════════════');
    console.log('  ✅ Database seeded successfully!');
    console.log('═══════════════════════════════════════');
    console.log('\n  Test Accounts:');
    console.log('  Admin: admin@smartleads.com / admin123');
    console.log('  Sales: sales@smartleads.com / sales123');
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
