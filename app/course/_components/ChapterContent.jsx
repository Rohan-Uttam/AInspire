import React, { useContext, useEffect, useState } from "react";
import { SelectedChapterIndexContext } from "@/context/SelectedChapterIndexContext";
import YouTube from "react-youtube";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

function ChapterContent({ courseInfo, refreshData }) {
  const { courseId } = useParams();
  const { selectedChapterIndex } = useContext(SelectedChapterIndexContext);

  const course = courseInfo?.courses;
  const enrollCourse = courseInfo?.enrollCourse;

  const courseContent = course?.courseContent;
  const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideos;
  const topics = courseContent?.[selectedChapterIndex]?.topics;
  const totalChapters = courseContent?.length || 0;

  const [completedChapters, setCompletedChapters] = useState([]);

  // ✅ Sync from DB initially and ensure array is correct length
  useEffect(() => {
    if (Array.isArray(enrollCourse?.completedChapter)) {
      const incoming = [...enrollCourse.completedChapter];
      while (incoming.length < totalChapters) incoming.push(0);
      setCompletedChapters(incoming);
    } else {
      setCompletedChapters(Array(totalChapters).fill(0));
    }
  }, [enrollCourse?.completedChapter, totalChapters]);

  // ✅ Toggle logic for 0 <-> 1
  const toggleChapterCompletion = async () => {
    const updated = [...completedChapters];
    const current = updated[selectedChapterIndex];

    updated[selectedChapterIndex] = current === 1 ? 0 : 1;

    try {
      await axios.put("/api/enroll-course", {
        courseId,
        completedChapter: updated,
      });

      setCompletedChapters(updated);

      toast.success(
        current === 1
          ? "Chapter marked as Incomplete ❌"
          : "Chapter marked as Completed ✅"
      );

      refreshData?.();
    } catch (error) {
      console.error("Error updating chapter status:", error);
      toast.error("Something went wrong");
    }
  };

  const isChapterCompleted = completedChapters[selectedChapterIndex] === 1;

  return (
    <div className="flex-1 h-screen overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-10 py-6 max-w-full box-border">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h2 className="font-bold text-2xl break-words">
          {courseContent?.[selectedChapterIndex]?.chapterName}
        </h2>

        <Button
          onClick={toggleChapterCompletion}
          className="flex items-center gap-2"
          variant={isChapterCompleted ? "destructive" : "default"}
        >
          <CheckCircle className="w-4 h-4" />
          {isChapterCompleted ? "Mark as Incomplete" : "Mark as Completed"}
        </Button>
      </div>

      {videoData?.length > 0 && (
        <>
          <h2 className="my-4 font-bold text-lg">Related Videos 🎥</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-full">
            {videoData.slice(0, 2).map((video, index) => (
              <div
                key={index}
                className="w-full aspect-video rounded-xl shadow-lg border border-gray-300 overflow-hidden"
              >
                <YouTube
                  videoId={video?.videoId}
                  opts={{ width: "100%", height: "100%" }}
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-6 space-y-6">
        {topics?.map((topic, index) => (
          <div
            key={index}
            className="p-4 md:p-5 bg-secondary rounded-2xl shadow-sm overflow-hidden"
          >
            <h2 className="font-bold text-xl md:text-2xl text-primary mb-3 break-words">
              {topic?.topic}
            </h2>
            <div
              className="prose max-w-full text-justify"
              dangerouslySetInnerHTML={{ __html: topic?.content }}
              style={{ lineHeight: "2", overflowWrap: "break-word" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterContent;
