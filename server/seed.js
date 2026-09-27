// ==========================================
// SEED DATABASE WITH SAMPLE DATA
// ==========================================

// dotenv is used to load the MongoDB URL from the .env file.
require("dotenv").config();

const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

// mongoose is used to connect to MongoDB.
const mongoose = require("mongoose");

// bcryptjs is used to hash passwords.
const bcrypt = require("bcryptjs");

// Import MongoDB models.
const User = require("./models/User");
const Event = require("./models/Event");

// ==========================================
// CONNECT TO DATABASE
// ==========================================

const seedDatabase = async () => {
    try {
        // Check whether MongoDB URL exists.
        if (!process.env.MONGODB_URI) {
            throw new Error(
                "MONGODB_URI is missing in the .env file"
            );
        }

        // Connect to MongoDB.
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // ==========================================
        // CLEAR OLD SEED DATA
        // ==========================================
        await Event.deleteMany({});
        await User.deleteMany({});
        console.log("Old data cleared");

        // ==========================================
        // CREATE PASSWORDS
        // ==========================================
        const adminPassword = await bcrypt.hash("Admin@123", 10);
        const userPassword = await bcrypt.hash("User@123", 10);

        // ==========================================
        // CREATE ADMIN USER
        // ==========================================
       const admin = await User.create({
            name: "Event Canvas Admin",
            email: "admin@eventcanvas.com",
            password: "Admin@123",
            role: "admin",
            isVerified: true
        });

        // ==========================================
        // CREATE NORMAL USERS
        // ==========================================
        const user1 = await User.create({
            name: "Rahul Sharma",
            email: "rahul@example.com",
            password: userPassword,
            role: "user",
            isVerified: true
        });

        const user2 = await User.create({
            name: "Priya Das",
            email: "priya@example.com",
            password: userPassword,
            role: "user",
            isVerified: true
        });

        console.log("Users created");

        // ==========================================
        // CREATE SAMPLE EVENTS
        // ==========================================
        const events = [
            {
                title: "Tech Innovation Summit",
                description:
                    "A technology event where students, developers and professionals can learn about modern technologies and future innovations.",
                date: new Date("2026-09-15T10:00:00"),
                time: "10:00",
                location: "Kolkata",
                category: "Technology",
                totalSeats: 200,
                availableSeats: 200,
                ticketPrice: 499,
                imageUrl:
                    "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
                status: "approved",
                createdBy: admin._id
            },
            {
                title: "Music Festival 2026",
                description:
                    "An exciting live music festival featuring local artists, bands and performances.",
                date: new Date("2026-09-25T18:00:00"),
                time: "18:00",
                location: "Kolkata",
                category: "Music",
                totalSeats: 500,
                availableSeats: 500,
                ticketPrice: 799,
                imageUrl:
                    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
                status: "approved",
                createdBy: admin._id
            },
            {
                title: "Startup & Business Meetup",
                description:
                    "Meet entrepreneurs, startup founders and students interested in building new businesses.",
                date: new Date("2026-10-05T11:00:00"),
                time: "11:00",
                location: "Salt Lake",
                category: "Business",
                totalSeats: 150,
                availableSeats: 150,
                ticketPrice: 299,
                imageUrl:
                    "https://images.unsplash.com/photo-1556761175-b413da4baf72",
                status: "approved",
                createdBy: admin._id
            },
            {
                title: "Photography Workshop",
                description:
                    "A practical photography workshop covering camera basics, composition, lighting and outdoor photography.",
                date: new Date("2026-10-18T09:30:00"),
                time: "09:30",
                location: "New Town",
                category: "Workshop",
                totalSeats: 50,
                availableSeats: 50,
                ticketPrice: 599,
                imageUrl:
                    "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848",
                status: "approved",
                createdBy: admin._id
            },
            {
                title: "College Cultural Fest",
                description:
                    "A college cultural event with music, dance, drama, competitions and other student activities.",
                date: new Date("2026-11-10T10:00:00"),
                time: "10:00",
                location: "Narula Institute of Technology",
                category: "Cultural",
                totalSeats: 1000,
                availableSeats: 1000,
                ticketPrice: 199,
                imageUrl:
                    "https://images.unsplash.com/photo-1511578314322-379afb476865",
                status: "approved",
                createdBy: admin._id
            }
        ];

        // Insert all events into MongoDB.
        await Event.insertMany(events);
        console.log("Events created");

        // ==========================================
        // DISPLAY LOGIN INFORMATION
        // ==========================================
        console.log("\n==========================================");
        console.log("DATABASE SEEDED SUCCESSFULLY");
        console.log("==========================================");

        console.log("\nAdmin Login:");
        console.log("Email: admin@eventcanvas.com");
        console.log("Password: Admin@123");

        console.log("\nUser Login:");
        console.log("Email: rahul@example.com");
        console.log("Password: User@123");

        console.log("\nSecond User Login:");
        console.log("Email: priya@example.com");
        console.log("Password: User@123");

        console.log("\n==========================================");

        // Close MongoDB connection after execution.
        await mongoose.connection.close();
        console.log("MongoDB connection closed");

    } catch (error) {
        console.error(
            "Database seeding failed:",
            error.message
        );
        await mongoose.connection.close();
        process.exit(1);
    }
};

// ==========================================
// RUN SEED FUNCTION
// ==========================================
seedDatabase();