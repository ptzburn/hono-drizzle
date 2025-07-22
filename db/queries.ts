import type { UUID } from "node:crypto";
import Argon2id from "@rabbit-company/argon2id";
import { db } from "./db.ts";
import {todosTable, usersTable} from "./schema.ts";
import { desc, eq } from "drizzle-orm";

export type NewTodo = {
  userId: UUID;
  title: string;
  description?: string;
  completed?: boolean;
};

export async function insertUser(email: string, password: string) {
  const passwordHash = await Argon2id.hash(password)

  const [user] = await db.insert(usersTable).values({
    email,
    passwordHash
  }).returning()

  return user.id as UUID;
}

export async function insertTodo(todo: NewTodo) {
  const [createdTodo] = await db.insert(todosTable)
    .values(todo)
    .returning();

  return createdTodo;
}

export async function getTodosByUserId(userId: UUID) {
  const todos = await db.select()
    .from(todosTable)
    .where(eq(todosTable.userId, userId))
    .orderBy(desc(todosTable.createdAt));

  return todos;
}
