import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { relations } from "./relations";

const sqlite = new Database(Bun.env.DB_FILE_NAME);
export const db = drizzle({ client: sqlite, relations });


