const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const resetDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventora");
        console.log("Connected to MongoDB...");

        // Drop users collection completely to clear broken password hashes and index mismatches
        await mongoose.connection.collection("users").drop().catch(() => console.log("Users collection already clear."));

        // Generate clean bcrypt hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);

        // Directly insert raw admin document into collection
        await mongoose.connection.collection("users").insertOne({
            name: "System Admin",
            email: "admin@theeventcanvas.com",
            password: hashedPassword,
            role: "admin",
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log("\n=================================");
        console.log("Admin account successfully created!");
        console.log("Email:    admin@theeventcanvas.com");
        console.log("Password: admin123");
        console.log("=================================\n");

        process.exit();
    } catch (error) {
        console.error("Error resetting DB:", error);
        process.exit(1);
    }
};

resetDB();