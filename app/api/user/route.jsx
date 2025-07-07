import { usersTable } from "@/config/schema";
import { db } from "@/config/db";  // adjust this path as per your project
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { name, email } = await req.json();

  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (users.length === 0) {
    const result = await db
      .insert(usersTable)
      .values({
        name: name,
        email: email,
      })
      .returning();

    console.log(result);
    return NextResponse.json(result);
  }

  return NextResponse.json(users[0]);
}
