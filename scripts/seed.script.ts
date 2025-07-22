import * as schema from "../db/schema.ts";
import { reset, seed } from "drizzle-seed";
import { db, pool } from "../db/db.ts";

export async function seedDb() {
  await reset(db, schema);

  await seed(db, schema).refine((funcs) => ({
    usersTable: {
      columns: {
        age: funcs.int({ minValue: 0, maxValue: 120 }),
      },
      count: 10,
      with: {
        todosTable: 10,
      },
    },
    todosTable: {
      columns: {
        title: funcs.valuesFromArray({
          values: [
            "Buy groceries",
            "Walk the dog",
            "Read a book",
            "Write some code",
            "Go for a run",
          ],
        }),
        description: funcs.valuesFromArray({
          values: [
            "very carefully",
            "very focused",
            "remember to stretch",
            "keep things clean",
          ],
        }),
      },
    },
  }));
}

seedDb().then(() => {
  console.log("Database was seeded successfully.");
  return pool.end();
}).catch((err) => {
  console.error(err);
  return pool.end();
});
