import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import app from "../app"; // Your Express app
import User from "../models/User"; // Your User model

jest.mock("jsonwebtoken");

describe("User Registration API", () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    test("Should return 400 if required fields are missing", async () => {
        const res = await request(app).post("/api/register").send({ email: "test@example.com" });
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("❌ Please enter all fields");
    });

    test("Should return 400 for invalid email format", async () => {
        const res = await request(app).post("/api/register").send({
            username: "testuser",
            password: "Password@123",
            email: "invalidemail",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("❌ Please enter a valid email address❗");
    });

    test("Should return 400 for invalid password format", async () => {
        const res = await request(app).post("/api/register").send({
            username: "testuser",
            password: "123",
            email: "test@example.com",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe(
            "🚫 Password must be between 8 to 15 characters containing at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"
        );
    });

    test("Should return 400 if email already exists", async () => {
        await User.create({
            username: "existinguser",
            email: "test@example.com",
            password: await bcrypt.hash("Password@123", 10),
        });

        const res = await request(app).post("/api/register").send({
            username: "newuser",
            password: "Password@123",
            email: "test@example.com",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("🚫 This email already exists!");
    });

    test("Should successfully register a user and return 201", async () => {
        jwt.sign.mockImplementation((payload, secret, options, callback) => {
            callback(null, "testtoken");
        });

        const res = await request(app).post("/api/register").send({
            username: "testuser",
            password: "Password@123",
            email: "test@example.com",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty("username", "testuser");
        expect(res.body).toHaveProperty("token", "testtoken");
        expect(res.body.msg).toBe("Successfully Logged in🥇");
    });

    test("Should handle server errors gracefully", async () => {
        jest.spyOn(User, "create").mockImplementationOnce(() => {
            throw new Error("Database Error");
        });

        const res = await request(app).post("/api/register").send({
            username: "testuser",
            password: "Password@123",
            email: "test@example.com",
        });

        expect(res.statusCode).toBe(500);
        expect(res.body.msg).toBe("Something went wrong! Please try again later");
    });
});