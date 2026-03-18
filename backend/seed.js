const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Design = require("./models/Design");
const Furniture = require("./models/Furniture");
const Feedback = require("./models/Feedback");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Atlas. Wiping old data...");

    await User.deleteMany();
    await Design.deleteMany();
    await Furniture.deleteMany();
    await Feedback.deleteMany();

    console.log("1/4: Inserting Users...");
    const users = await User.insertMany([
      {
        name: "Shop Admin",
        email: "admin@furniture.com",
        password: "hash123",
        role: "admin",
      },
      {
        name: "Test User 1",
        email: "tester1@university.ac.uk",
        password: "hash123",
        role: "user",
      },
      {
        name: "Test User 2",
        email: "tester2@university.ac.uk",
        password: "hash123",
        role: "user",
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: "hash123",
        role: "user",
      },
    ]);

    console.log("2/4: Inserting Furniture Catalog...");
    const catalog = await Furniture.insertMany([
      {
        name: "Modern Leather Sofa",
        category: "Living Room",
        dimensions: "200x90x85cm",
        isMovable: true,
      },
      {
        name: "Oak Coffee Table",
        category: "Living Room",
        dimensions: "100x50x45cm",
        isMovable: true,
      },
      {
        name: "King Size Bed",
        category: "Bedroom",
        dimensions: "200x200x60cm",
        isMovable: true,
      },
      {
        name: "Minimalist Wardrobe",
        category: "Bedroom",
        dimensions: "150x60x220cm",
        isMovable: true,
      },
      {
        name: "Ergonomic Office Chair",
        category: "Office",
        dimensions: "65x65x110cm",
        isMovable: true,
      },
      {
        name: "Glass Standing Desk",
        category: "Office",
        dimensions: "140x70x75-120cm",
        isMovable: true,
      },
      {
        name: "Bookshelf Unit",
        category: "Living Room",
        dimensions: "80x30x180cm",
        isMovable: true,
      },
      {
        name: "Dining Table",
        category: "Kitchen",
        dimensions: "160x90x75cm",
        isMovable: true,
      },
    ]);

    console.log("3/4: Inserting Saved Designs...");
    await Design.insertMany([
      {
        user: users[1]._id,
        roomLayout: { width: 500, height: 400, type: "Living Room" },
        furnitureItems: [catalog[0]._id, catalog[1]._id],
        wallColor: "#f4f4f4",
      },
      {
        user: users[2]._id,
        roomLayout: { width: 600, height: 600, type: "Bedroom" },
        furnitureItems: [catalog[2]._id, catalog[3]._id],
        wallColor: "#ddeeff",
      },
      {
        user: users[3]._id,
        roomLayout: { width: 300, height: 400, type: "Office" },
        furnitureItems: [catalog[4]._id, catalog[5]._id],
        wallColor: "#ffffff",
      },
      {
        user: users[1]._id,
        roomLayout: { width: 800, height: 600, type: "Kitchen" },
        furnitureItems: [catalog[7]._id],
        wallColor: "#faebd7",
      },
    ]);

    console.log("4/4: Inserting Usability Feedback...");
    await Feedback.insertMany([
      {
        user: users[1]._id,
        usabilityScore: 9,
        comments: "The 3D rotation was very intuitive.",
        testedUI: "FurnitureViewer3D",
      },
      {
        user: users[2]._id,
        usabilityScore: 8,
        comments:
          "Room layout canvas was easy to use, but needed better contrast.",
        testedUI: "RoomLayoutCanvas",
      },
      {
        user: users[3]._id,
        usabilityScore: 10,
        comments: "Saving designs to the database was seamless.",
        testedUI: "SaveDesign Flow",
      },
    ]);

    console.log("✅ HUGE database seeded successfully! 4 Collections created.");
    process.exit();
  } catch (error) {
    console.error(`❌ Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
