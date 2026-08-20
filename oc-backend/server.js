import "dotenv/config";
import { connectDB } from "./src/db/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
