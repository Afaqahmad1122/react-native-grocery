import { desc, eq } from "drizzle-orm";
import { db } from "./db/client";
import { groceryItem } from "./db/schema";

export const listGroceryItems = async () => {
  const rows = await db
    .select()
    .from(groceryItem)
    .orderBy(desc(groceryItem.updated_at));

  return rows;
};

// create a grocery item
export const createGroceryItem = async (input: {
  name: string;
  category: string;
  quantity: number;
  priority: string;
  purchased: boolean;
}) => {
  const rows = await db
    .insert(groceryItem)
    .values({
      id: crypto.randomUUID(),
      name: input.name,
      category: input.category,
      quantity: Math.max(1, Math.min(5, input.quantity)),
      priority: input.priority,
      purchased: false,
      updated_at: Date.now(),
    })
    .returning();

  return rows[0];
};

// set grocery item purchased
export const setGroceryItemPurchased = async (
  id: string,
  purchased: boolean,
) => {
  const rows = await db
    .update(groceryItem)
    .set({ purchased, updated_at: Date.now() })
    .where(eq(groceryItem.id, id))
    .returning();

  if (!rows.length) return null;
  return rows[0];
};

// update grocery item quantity
export const updateGroceryItemQuantity = async (
  id: string,
  quantity: number,
) => {
  const rows = await db
    .update(groceryItem)
    .set({
      quantity: Math.max(1, Math.floor(quantity)),
      updated_at: Date.now(),
    })
    .where(eq(groceryItem.id, id))
    .returning();

  if (!rows.length) return null;
  return rows[0];
};

// delete grocery item
export const deleteGroceryItem = async (id: string) => {
  const rows = await db
    .delete(groceryItem)
    .where(eq(groceryItem.id, id))
    .returning();

  return rows.length > 0;
};

// clear purchased items
export const clearPurchasedItems = async () => {
  const rows = await db
    .update(groceryItem)
    .set({ purchased: false, updated_at: Date.now() })
    .where(eq(groceryItem.purchased, true))
    .returning();

  return rows.length > 0;
};
