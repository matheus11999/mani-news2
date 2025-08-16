import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

const DATABASE_URL = process.env.DATABASE_URL || "postgres://mani:260520jm@evoapi_maninews-postgres:5432/mani?sslmode=disable";

// Create the postgres connection
const connection = postgres(DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create the drizzle database instance
export const db = drizzle(connection, { schema });

// Test connection function
export async function testConnection() {
  try {
    await connection`SELECT 1`;
    console.log("✅ Database connection successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}