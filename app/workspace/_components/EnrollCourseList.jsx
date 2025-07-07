"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import EnrollCourseCard from "./EnrollCourseCard"; // Ensure correct path

function EnrollCourseList() {
  const [enrollCourseList, setEnrolledCourseList] = useState([]);

  useEffect(() => {
    GetEnrolledCourse();
  }, []);

  const GetEnrolledCourse = async () => {
    try {
      const result = await axios.get("/api/enroll-course");
      console.log(result.data);
      setEnrolledCourseList(result.data);
    } catch (error) {
      console.error("Failed to fetch enrolled courses:", error);
    }
  };

  return (
    enrollCourseList?.length > 0 && (
      <div className="mt-3">
        <h2 className="font-bold text-xl mb-4">
          Continue Learning your Course
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {enrollCourseList?.map((course, index) => (
            <EnrollCourseCard
              course={course?.courses}
              enrollCourse={course}
              key={index}
            />
          ))}
        </div>
      </div>
    )
  );
}

export default EnrollCourseList;
