import { beforeEach, afterEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertExists } from "@std/assert";
import { stub, Stub } from "@std/testing/mock";
import { insertTodo, insertUser, NewTodo } from "../../db/queries.ts";
import { db } from "../../db/db.ts";
import { createTestDb, destroyTestDb, TestDbContext } from "../setup-test-db.ts";
import { todosTable } from "../../db/schema.ts";

let ctx: TestDbContext;
let insertStub: Stub;

beforeEach(async () => {
  ctx = await createTestDb();
  // Stub db.insert to use ctx.db.insert
  insertStub = stub(db, "insert", (table) => {
    if (table === todosTable) {
      // Return ctx.db.insert for the todosTable
      return ctx.db.insert(todosTable);
    }
    // Optionally handle other tables or throw an error
    throw new Error("Unexpected table in db.insert");
  });
});

afterEach(async () => {
  insertStub.restore();
  await destroyTestDb(ctx);
});

describe("insertTodo", () => {
  it("should insert a todo into the database", async () => {
    // Create a user to get a valid userId
    const userId = await insertUser("test@test.com", "password123");

    const newTodo = {
      userId,
      title: "Test todo",
      description: "Test description",
    } as NewTodo;

    const todo = await insertTodo(newTodo);

    assertEquals(todo.userId, newTodo.userId);
    assertExists(todo.id);
  });
});