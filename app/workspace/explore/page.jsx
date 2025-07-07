"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CourseCard from "../_components/CourseCard"; // ✅ Fixed path
import { Skeleton } from "@/components/ui/skeleton";

function Explore() {
  const [courseList, setCoursesList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) GetCourseList();
  }, [user]);

  const GetCourseList = async () => {
    try {
      const result = await axios.get("/api/courses?courseId=0");
      console.log(result.data);
      setCoursesList(result.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  return (
    <div className="p-5">
      <h2 className="font-bold text-3xl mb-6">Explore More Courses</h2>

      <div className="flex gap-5 max-w-md mb-6">
        <Input placeholder="Search" className="flex-1" />
        <Button>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {courseList.length > 0
          ? courseList?.map((course, index) => (
              <CourseCard course={course} key={index} />
            ))
          : [0, 1, 2, 3].map((item,index) => <Skeleton key={index} className= 'w-full h-[240px]' />)}
      </div>
    </div>
  );
}

export default Explore;
