const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

describe("Auth Routes", () => {

    test("Register a new user", async() => {
        const res = await request(app)
        .post("/api/auth/register")
        .send({
            email: "test@test.com",
            password: "123456"
        })
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("User registered successfully");

        const user = await User.findOne({email: "test@test.com" })
        expect(user).not.toBeNull();
    })
    test("Register with duplicate Email", async() => {
        await User.create({
            email: "duplicate@test.com",
            password: "hashed" 
        })

        const res = await request(app)
        .post("/api/auth/register")
        .send({
            email: "duplicate@test.com",
            password: "123456"
        })
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("User already exists");
    })



    test("login a user", async() => {
        await request(app)
        .post("/api/auth/register")
        .send({
            email: "test@test.com",
            password: "123456"
        })

        const res = await request(app)
        .post("/api/auth/login")
        .send({
            email: "test@test.com",
            password: "123456"
        })
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    })
    test("login a Invalid Email", async() => {
        await request(app)
        .post("/api/auth/register")
        .send({
            email: "test@test.com",
            password: "hashed"
        })

        const res = await request(app)
        .post("/api/auth/login")
        .send({
            email: "duplicate@duplicate.com",
            password: "123456"
        })
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Invalid user name");
    })
    test("login a Invalid Password", async() => {
        await request(app)
        .post("/api/auth/register")
        .send({
            email: "test@test.com",
            password: "123456"
        })

        const res = await request(app)
        .post("/api/auth/login")
        .send({
            email: "test@test.com",
            password: "duplicate"
        })
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Invalid password");
    })

    test("access profile with token", async() => {
        await request(app)
        .post("/api/auth/register")
        .send({
            email: "test@test.com",
            password: "123456"
        })

        const login = await request(app)
        .post("/api/auth/login")
        .send({
            email: "test@test.com",
            password: "123456"
        })

        const token = login.body.token

        const res = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe("test@test.com");
        expect(res.body.password).toBeUndefined();
    })
    test("No access in profile without token", async() => {
        const res = await request(app)
        .get("/api/auth/profile");

        expect(res.statusCode).toBe(401)
    })
})