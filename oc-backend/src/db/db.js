import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("DB connected successfully");
    console.log("Database:", mongoose.connection.name);

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    console.log(
      "Collections:",
      collections.map((collection) => collection.name),
    );

    const productCount = await mongoose.connection.db
      .collection("products")
      .countDocuments();

    console.log("Products in DB:", productCount);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}
