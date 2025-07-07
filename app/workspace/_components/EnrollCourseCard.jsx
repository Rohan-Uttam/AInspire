"use client";
import React from "react";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function EnrollCourseCard({ course, enrollCourse }) {
  const courseJson = course?.courseJson?.course;

  const CalculatePerProgress = () => {
    const totalChapters = course?.courseContent?.length || 0;
    const completedChapters =
      enrollCourse?.completedChapters?.filter((ch) => ch === 1).length || 0;

    if (totalChapters === 0) return 0;
    return Math.floor((completedChapters / totalChapters) * 100);
  };

  const progress = CalculatePerProgress();

  return (
    <div className="shadow rounded-xl">
      <Image
        src={course?.bannerImageUrl}
        alt={course?.name}
        width={400}
        height={300}
        className="w-full aspect-video rounded-xl object-cover"
      />
      <div className="p-3 flex flex-col gap-3">
        <h2 className="font-bold text-lg">{courseJson?.name}</h2>
        <p className="line-clamp-3 text-gray-400 text-sm">
          {courseJson?.description}
        </p>
        <div>
          <h2 className="flex justify-between text-sm text-primary">
            Progress <span>{progress}%</span>
          </h2>
          <Progress value={progress} />
          <Link href={`/workspace/view-course/${course?.cid}`}>
            <Button className="w-full mt-3">
              <PlayCircle className="w-4 h-4 mr-2" />
              Continue Learning
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EnrollCourseCard;
