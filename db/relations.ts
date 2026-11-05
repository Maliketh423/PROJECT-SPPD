import * as schema from "./auth-schema";
import { defineRelations } from "drizzle-orm";

export const relations = defineRelations(schema, (r) => ({}));
