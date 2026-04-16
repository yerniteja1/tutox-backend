import dotenv from "dotenv";
import { buildApp } from "./app";

dotenv.config();

const start = async () => {
  const app = buildApp();

  try {
    await app.listen({
      port: Number(process.env.PORT),
      host: "0.0.0.0",
    });
    console.log(`Server running on PORT: ${process.env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
