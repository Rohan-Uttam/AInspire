import React, { useContext } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SelectedChapterIndexContext } from "@/context/SelectedChapterIndexContext";
import { CheckCircle } from "lucide-react";

function ChapterListSidebar({ courseInfo, completedChapter = [] }) {
  const course = courseInfo?.courses;
  const courseContent = course?.courseContent;

  const { selectedChapterIndex, setSelectedChapterIndex } = useContext(
    SelectedChapterIndexContext
  );

  return (
    <div className="w-full md:w-96 bg-secondary h-screen p-5">
      <h2 className="mb-4 font-bold text-xl">
        Chapters ({courseContent?.length || 0})
      </h2>

      <div className="overflow-y-auto flex-1 pr-2">
        <Accordion type="single" collapsible>
          {courseContent?.map((chapter, index) => {
            const isCompleted = completedChapter?.[index] === 1;
            const isSelected = selectedChapterIndex === index;

            return (
              <AccordionItem
                value={`item-${index}`}
                key={index}
                onClick={() => setSelectedChapterIndex(index)}
                className={`rounded-lg my-1 transition-colors ${
                  isCompleted
                    ? "bg-green-100 border-l-4 border-green-500"
                    : isSelected
                    ? "bg-blue-100 border-l-4 border-blue-500"
                    : "bg-white"
                }`}
              >
                <AccordionTrigger
                  className={`text-lg font-medium px-4 py-3 flex justify-between items-center ${
                    isCompleted ? "text-green-700" : "text-black"
                  }`}
                >
                  <span>{chapter?.chapterName}</span>
                  {isCompleted && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </AccordionTrigger>

                <AccordionContent asChild>
                  <div className="px-4 pb-3">
                    {chapter?.topics?.map((topic, idx) => (
                      <h2 key={idx} className="p-3 bg-gray-100 my-1 rounded-md">
                        {topic?.topic}
                      </h2>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}

export default ChapterListSidebar;
