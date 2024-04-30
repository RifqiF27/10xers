const app = require("../app");
const request = require("supertest");
const { User, sequelize } = require("../models");
const { describe, it, expect } = require("@jest/globals");
const { hasPass } = require("../helpers/bcrypt");

beforeAll(async () => {
  try {
    await User.create({
      username: "Admin",
      email: "admin@mail.com",
      password: hasPass("admin123"),
      role: "Admin",
    });
    const products = require("../db/products.json").map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    });
    await sequelize.queryInterface.bulkInsert("Products", products);
  } catch (err) {
    console.log(err);
  }
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await sequelize.queryInterface.bulkDelete("Products", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("/register", () => {
  it("should successfully register", async () => {
    const response = await request(app).post("/register").send({
      username: "Admin1",
      email: "admin1@mail.com",
      password: "admin123",
      role: "Admin",
    });
    console.log(response.status);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  it("should handle empty username", async () => {
    const response = await request(app).post("/register").send({
      email: "admin@mail.com",
      password: "admin123",
      role: "Admin",
    });
    console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Username is required");
  });

  it("should handle empty email", async () => {
    const response = await request(app).post("/register").send({
      username: "Admin",
      password: "admin123",
      role: "Admin",
    });
    console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required");
  });
  it("should handle empty password", async () => {
    const response = await request(app).post("/register").send({
      username: "Admin",
      email: "admin@mail.com",
      role: "Admin",
    });
    console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Password is required");
  });
  it("should handle invalid format email", async () => {
    const response = await request(app).post("/register").send({
      username: "Admin",
      email: "admin",
      password: "admin123",
      role: "Admin",
    });
    console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email format is invalid");
  });
  it("should handle email already register", async () => {
    const response = await request(app).post("/register").send({
      username: "Admin",
      email: "admin@mail.com",
      password: "admin123",
      role: "Admin",
    });
    console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email already registered");
  });
  it("should handle role must be 'Admin or 'Customer'", async () => {
    const response = await request(app).post("/register").send({
      username: "Admin",
      email: "admin1@mail.com",
      password: "admin123",
      role: "Adminn",
    });
    console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Role must be 'Admin' or 'Customer'"
    );
  });
});

describe("/login", () => {
  it("should successfully login", async () => {
    const response = await request(app).post("/login").send({
      email: "admin1@mail.com",
      password: "admin123",
    });
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
  });
  it("should handle incorrect email or password", async () => {
    const response = await request(app).post("/login").send({
      email: "admin@mail.com",
      password: "admin12",
    });
    console.log(response.body);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });

  it("should handle email not registered", async () => {
    const response = await request(app).post("/login").send({
      email: "admin123@mail.com",
      password: "admin123",
    });
    console.log(response.body);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Email is not registered");
  });
});
describe("/products", () => {
  it("should get products without query", async () => {
    const login = await request(app).post("/login").send({
      email: "admin1@mail.com",
      password: "admin123",
    });
    const token = login.body.access_token;
    console.log(token);
    const response = await request(app)
      .get("/view-products")
      .set("access_token", token);
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
  it("should get products with query", async () => {
    const login = await request(app).post("/login").send({
      email: "admin1@mail.com",
      password: "admin123",
    });
    const token = login.body.access_token;
    console.log(token);
    const response = await request(app)
      .get("/view-products?name=pro")
      .set("access_token", token);
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
  it("should add products", async () => {
    const login = await request(app).post("/login").send({
      email: "admin1@mail.com",
      password: "admin123",
    });
    const token = login.body.access_token;
    console.log(token);
    const response = await request(app)
      .post("/add-product")
      .set("access_token", token)
      .send({
        name: "Iphone x",
        color: "white",
        price: 9000000,
        description: "iPhone x. Layar Super Retina XDR 6 inci yang begitu cerah.1 Ceramic Shield dengan ketahanan jatuh empat kali lebih baik.2 Fotografi pencahayaan rendah yang menakjubkan dengan mode Malam di semua kamera. Mampu merekam, mengedit, dan memutar video sekelas sinema dengan Dolby Vision. Chip A13 Bionic yang andal. Dan aksesori MagSafe baru untuk kemudahan pemasangan dan pengisian daya nirkabel yang lebih cepat.",
        stock: 1,
        imgUrl: "www.example.com",
      });
    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
  });
  it("should edit products", async () => {
    const login = await request(app).post("/login").send({
      email: "admin1@mail.com",
      password: "admin123",
    });
    const token = login.body.access_token;
    console.log(token);
    const response = await request(app)
      .put("/edit-product/1")
      .set("access_token", token)
      .send({
        name: "Iphone x",
        color: "white",
        price: 9000000,
        description: "iPhone x. Layar Super Retina XDR 6 inci yang begitu cerah.1 Ceramic Shield dengan ketahanan jatuh empat kali lebih baik.2 Fotografi pencahayaan rendah yang menakjubkan dengan mode Malam di semua kamera. Mampu merekam, mengedit, dan memutar video sekelas sinema dengan Dolby Vision. Chip A13 Bionic yang andal. Dan aksesori MagSafe baru untuk kemudahan pemasangan dan pengisian daya nirkabel yang lebih cepat.",
        stock: 1,
        imgUrl: "www.example.com",
      });
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Product has been updated" );
  });
  it("should handle edit products missing params", async () => {
    const login = await request(app).post("/login").send({
      email: "admin1@mail.com",
      password: "admin123",
    });
    const token = login.body.access_token;
    console.log(token);
    const response = await request(app)
      .put("/edit-product/99")
      .set("access_token", token)
      .send({
        name: "Iphone x",
        color: "white",
        price: 9000000,
        description: "iPhone x. Layar Super Retina XDR 6 inci yang begitu cerah.1 Ceramic Shield dengan ketahanan jatuh empat kali lebih baik.2 Fotografi pencahayaan rendah yang menakjubkan dengan mode Malam di semua kamera. Mampu merekam, mengedit, dan memutar video sekelas sinema dengan Dolby Vision. Chip A13 Bionic yang andal. Dan aksesori MagSafe baru untuk kemudahan pemasangan dan pengisian daya nirkabel yang lebih cepat.",
        stock: 1,
        imgUrl: "www.example.com",
      });
    console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Product not found" );
  });
  it("should delete products", async () => {
    const login = await request(app).post("/login").send({
      email: "admin1@mail.com",
      password: "admin123",
    });
    const token = login.body.access_token;
    console.log(token);
    const response = await request(app)
      .delete("/delete-product/1")
      .set("access_token", token)
      ;
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Delete success" );
  });
  it("should handle delete products missing params", async () => {
    const login = await request(app).post("/login").send({
      email: "admin1@mail.com",
      password: "admin123",
    });
    const token = login.body.access_token;
    console.log(token);
    const response = await request(app)
      .delete("/delete-product/99")
      .set("access_token", token)
      ;
    console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Product not found" );
  });
});
describe("/public/products", () => {
  it("should get products without query", async () => {
    const response = await request(app).get("/public/products");
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.Products).toBeInstanceOf(Object);
  });
  it("should get products with query", async () => {
    const response = await request(app).get(
      "/public/products?page=&itemsPage=&name="
    );
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.Products).toBeInstanceOf(Object);
  });
  it("should get products with params", async () => {
    const response = await request(app).get("/public/product/2");
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });
  it("should handle get products with missing params", async () => {
    const response = await request(app).get("/public/product/99");
    console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Product not found");
  });
});
