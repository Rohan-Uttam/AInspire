import React, { useState } from "react";
import axios from "axios"; // ✅ added
import { Clock, Book, TrendingUp, PlayCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // ✅ For App Router (Next.js 13+)
import Link from "next/link";


function CourseInfo({ course,viewCourse }) {
  const courseLayout = course?.courseJson?.course;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const GenerateCourseContent = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/generate-course-content", {
        course: courseLayout,
        courseTitle: course?.name,
        courseId: course?.cid,
      });
      console.log(result.data);
      setLoading(false); 
      router.replace('/workspace')
      toast.success('Courses Generated Sucessfully')
    } catch (e) {
      console.log(e);
      setLoading(false);
      toast.error("Server Side error, Try Again!!")
    }
  };

  return (
    <div className="md:flex gap-5 justify-between p-5 rounded-2xl shadow">
      <div className="flex flex-col gap-3">
        <h2 className="font-bold text-3xl">{courseLayout?.name}</h2>
        <p className="line-clamp-2 text-gray-500">
          {courseLayout?.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex gap-5 items-center p-3 rounded-lg shadow">
            <Clock className="text-blue-500" />
            <section>
              <h2 className="font-bold">Duration</h2>
              <h2>2 Hours</h2>
            </section>
          </div>
          <div className="flex gap-5 items-center p-3 rounded-lg shadow">
            <Book className="text-green-500" />
            <section>
              <h2 className="font-bold">Chapters</h2>
              <h2>2</h2>
            </section>
          </div>
          <div className="flex gap-5 items-center p-3 rounded-lg shadow">
            <TrendingUp className="text-red-500" />
            <section>
              <h2 className="font-bold">Difficulty Level</h2>{" "}
              {/* ✅ fixed spelling */}
              <h2>{course?.level}</h2>
            </section>
          </div>
        </div>
        {!viewCourse ? (
          <Button onClick={GenerateCourseContent}>
            {loading ? "Generating..." : "Generate Content"}
          </Button>
        ) : (
          <Link href={'/course/'+ course?.cid}>
            <Button>
              <PlayCircle />
              Continue Learning
            </Button>
          </Link>
        )}
      </div>

      <Image
        src={course?.bannerImageUrl}
        alt="banner Image"
        width={400}
        height={400}
        className="w-full mt-5 md:mt-0 object-cover aspect-auto h-[240px] rounded-2xl"
      />
    </div>
  );
}

export default CourseInfo;
