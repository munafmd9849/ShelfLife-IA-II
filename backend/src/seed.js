import 'dotenv/config';
import mongoose from 'mongoose';
import Book from './models/Book.js';
import Member from './models/Member.js';
import BorrowRecord from './models/BorrowRecord.js';

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is missing in .env');
    process.exit(1);
  }

  console.log('Connecting to MongoDB Atlas (database: shelflife)...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected! Current database:', mongoose.connection.name);

  // Clear existing collections in shelflife database
  console.log('Clearing existing data in shelflife database...');
  await Promise.all([
    Book.deleteMany({}),
    Member.deleteMany({}),
    BorrowRecord.deleteMany({})
  ]);

  console.log('Inserting Books...');
  const booksData = [
    {
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      isbn: '978-0132350884',
      genre: 'Technology',
      totalCopies: 5,
      availableCopies: 4
    },
    {
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      isbn: '978-1449373320',
      genre: 'Technology',
      totalCopies: 4,
      availableCopies: 3
    },
    {
      title: 'Introduction to Algorithms (CLRS)',
      author: 'Thomas H. Cormen, Charles E. Leiserson',
      isbn: '978-0262033848',
      genre: 'Technology',
      totalCopies: 3,
      availableCopies: 1
    },
    {
      title: 'Dune',
      author: 'Frank Herbert',
      isbn: '978-0441172719',
      genre: 'Science Fiction',
      totalCopies: 4,
      availableCopies: 3
    },
    {
      title: 'Neuromancer',
      author: 'William Gibson',
      isbn: '978-0441569595',
      genre: 'Science Fiction',
      totalCopies: 2,
      availableCopies: 0 // Out of stock example for UI demo
    },
    {
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      isbn: '978-0062316097',
      genre: 'History',
      totalCopies: 4,
      availableCopies: 4
    },
    {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      isbn: '978-0547928227',
      genre: 'Fantasy',
      totalCopies: 3,
      availableCopies: 3
    },
    {
      title: 'Steve Jobs',
      author: 'Walter Isaacson',
      isbn: '978-1451648539',
      genre: 'Biography',
      totalCopies: 2,
      availableCopies: 2
    },
    {
      title: 'Cosmos',
      author: 'Carl Sagan',
      isbn: '978-0345331359',
      genre: 'Science',
      totalCopies: 3,
      availableCopies: 3
    },
    {
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      isbn: '978-0374533557',
      genre: 'Non-fiction',
      totalCopies: 3,
      availableCopies: 3
    },
    {
      title: 'The Silent Patient',
      author: 'Alex Michaelides',
      isbn: '978-1250301696',
      genre: 'Mystery',
      totalCopies: 2,
      availableCopies: 2
    }
  ];

  const createdBooks = await Book.insertMany(booksData);
  console.log(`✓ Inserted ${createdBooks.length} books.`);

  console.log('Inserting Members...');
  const membersData = [
    {
      name: 'Sarah Connor',
      email: 'sarah.connor@college.edu',
      membershipId: 'MEM-2026-101',
      joinedDate: new Date('2025-08-15')
    },
    {
      name: 'Alex Johnson',
      email: 'alex.johnson@college.edu',
      membershipId: 'MEM-2026-102',
      joinedDate: new Date('2025-09-01')
    },
    {
      name: 'Emily Davis',
      email: 'emily.davis@college.edu',
      membershipId: 'MEM-2026-103',
      joinedDate: new Date('2025-10-10')
    },
    {
      name: 'Prof. Alan Turing',
      email: 'alan.turing@college.edu',
      membershipId: 'FAC-2026-001',
      joinedDate: new Date('2024-01-10')
    },
    {
      name: 'Marcus Vance',
      email: 'marcus.vance@college.edu',
      membershipId: 'MEM-2026-104',
      joinedDate: new Date('2026-01-20')
    }
  ];

  const createdMembers = await Member.insertMany(membersData);
  console.log(`✓ Inserted ${createdMembers.length} members.`);

  console.log('Creating Sample Circulation / Borrow Records...');
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;

  const borrowRecords = [
    // 1. Overdue record for Sarah Connor (due 5 days ago, unreturned) -> Demonstrates OVERDUE badge!
    {
      book: createdBooks[0]._id, // Clean Code
      member: createdMembers[0]._id, // Sarah Connor
      issueDate: new Date(now - 19 * DAY),
      dueDate: new Date(now - 5 * DAY),
      returnDate: null,
      status: 'overdue'
    },
    // 2. Active issued loan for Sarah Connor (due in 8 days)
    {
      book: createdBooks[1]._id, // Designing Data-Intensive Applications
      member: createdMembers[0]._id, // Sarah Connor
      issueDate: new Date(now - 6 * DAY),
      dueDate: new Date(now + 8 * DAY),
      returnDate: null,
      status: 'issued'
    },
    // 3. Returned record for Sarah Connor (returned yesterday)
    {
      book: createdBooks[5]._id, // Sapiens
      member: createdMembers[0]._id, // Sarah Connor
      issueDate: new Date(now - 25 * DAY),
      dueDate: new Date(now - 11 * DAY),
      returnDate: new Date(now - 1 * DAY),
      status: 'returned'
    },
    // 4. Active issued loan for Alex Johnson
    {
      book: createdBooks[2]._id, // CLRS Algorithms
      member: createdMembers[1]._id, // Alex Johnson
      issueDate: new Date(now - 2 * DAY),
      dueDate: new Date(now + 12 * DAY),
      returnDate: null,
      status: 'issued'
    },
    // 5. Active loan holding final copy of Neuromancer (Alex Johnson)
    {
      book: createdBooks[4]._id, // Neuromancer
      member: createdMembers[1]._id, // Alex Johnson
      issueDate: new Date(now - 3 * DAY),
      dueDate: new Date(now + 11 * DAY),
      returnDate: null,
      status: 'issued'
    }
  ];

  const createdBorrows = await BorrowRecord.insertMany(borrowRecords);
  console.log(`✓ Inserted ${createdBorrows.length} circulation records.`);

  console.log('\n--- SEED COMPLETE ---');
  console.log(`Database "${mongoose.connection.name}" on Atlas is now populated with:`);
  console.log(`- ${createdBooks.length} Books across multiple genres`);
  console.log(`- ${createdMembers.length} Members (Students & Faculty)`);
  console.log(`- ${createdBorrows.length} Borrow records (including Overdue, Issued, and Returned)`);

  await mongoose.disconnect();
  console.log('MongoDB connection closed.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
