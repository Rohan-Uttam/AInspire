import { coursesTable, enrollCourseTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { eq, and, desc } from "drizzle-orm"; // ✅ Added 'desc'


export async function POST(req) {
  const { courseId } = await req.json();
  const user = await currentUser();
  const enrollCourses = await db
    .select()
    .from(enrollCourseTable)
    .where(
      and(
        eq(enrollCourseTable.userEmail, user?.primaryEmailAddress.emailAddress),
        eq(enrollCourseTable.cid, courseId)
      )
    );

  if (enrollCourses?.length == 0) {
    const result = await db
      .insert(enrollCourseTable)
      .values({
        cid: courseId,
        userEmail: user.primaryEmailAddress?.emailAddress,
      })
      .returning(enrollCourseTable);
    return NextResponse.json(result);
  }
  return NextResponse.json({ resp: "Already Enrolled" });
}


export async function GET(req){
const user = await currentUser();
const { searchParams } = new URL(req.url);
const courseId = searchParams?.get("courseId");
if(courseId){
  const result = await db
    .select()
    .from(coursesTable)

    .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
    .where(and(
      eq(enrollCourseTable.userEmail, user?.primaryEmailAddress.emailAddress),
      eq(enrollCourseTable.cid,courseId))
    )
   return NextResponse.json(result[0])
}
else{
const result = await db
  .select()
  .from(coursesTable)

  .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
  .where(
    eq(enrollCourseTable.userEmail, user?.primaryEmailAddress.emailAddress)
  )
  .orderBy(desc(enrollCourseTable.id));

  return NextResponse.json(result);
}
}

export async function PUT(req){
  const {completedChapter,courseId}= await req.json();
  const user = await currentUser();
  const result = await db.update(enrollCourseTable).set({
    completedChapters:completedChapter
  }).where(and(eq(enrollCourseTable.cid,courseId),
eq(enrollCourseTable.userEmail,user?.primaryEmailAddress?.emailAddress)))
.returning(enrollCourseTable)
 return NextResponse.json(result);
}