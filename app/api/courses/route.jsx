import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc, sql } from "drizzle-orm";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams?.get("courseId");
  const user = await currentUser();

  if (courseId === "0") {
    const result = await db
      .select()
      .from(coursesTable)
      .where(sql`${coursesTable.courseContent}::jsonb != '{}'::jsonb`)
      .orderBy(desc(coursesTable.id));

    return NextResponse.json(result);
  }

  if (courseId) {
    const result = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.cid, courseId));

    return NextResponse.json(result[0]);
  }
  const result = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.userEmail, user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(coursesTable.id));

  return NextResponse.json(result);
}
