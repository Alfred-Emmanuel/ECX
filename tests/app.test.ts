import request from "supertest";
import app from "../src";
import mongoose from "mongoose";

describe("GET /", () => {
  it("should return status 404 for undefined routes", async () => {
    const response = await request(app).get("/undefined-route");
    expect(response.status).toBe(404);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
