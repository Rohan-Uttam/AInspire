"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import AppHeader from "@/app/workspace/_components/AppHeader";
import ChapterListSidebar from "../_components/ChapterListSidebar";
import ChapterContent from "../_components/ChapterContent";

function Course() {
  const params = useParams();
  const courseId = params?.courseId;

  const [courseInfo, setCourseInfo] = useState();

  useEffect(() => {
    if (courseId) {
      GetEnrolledCourseById();
    }
  }, [courseId]);

  const GetEnrolledCourseById = async () => {
    try {
      const result = await axios.get("/api/enroll-course?courseId=" + courseId);
      console.log(result.data);
      setCourseInfo(result.data);
    } catch (error) {
      console.error("Failed to fetch enrolled courses:", error);
    }
  };

  return (
    <div>
      <AppHeader hideSidebar={true} />
      <div className="flex gap-10">
        <ChapterListSidebar courseInfo={courseInfo} />
        <ChapterContent courseInfo={courseInfo} refreshData={()=>GetEnrolledCourseById()} />
      </div>
    </div>
  );
}

export default Course;
