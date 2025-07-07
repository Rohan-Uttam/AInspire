import { NextResponse } from "next/server";
import { ai } from "../generate-course-layout/route";
import axios from "axios";

// ✅ Adjust import paths as per your folder structure
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema"; // ✅ Corrected path

import { eq } from "drizzle-orm";

const PROMPT = `
Given the chapter name and its topics, generate HTML content for each topic.
Return the response in the following strict JSON format:

{
  "chapterName": "<Chapter Name>",
  "topics": [
    {
      "topic": "<Topic Name>",
      "content": "<HTML content here>"
    }
  ]
}

User Input:
`;

// ✅ JSON safe parser
function safeJsonParse(raw) {
  try {
    const match = raw.match(/{[\s\S]*}/);
    if (!match) return null;
    const cleaned = match[0].replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ JSON Parse Error:", err);
    return null;
  }
}

// ✅ YouTube search logic
const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

const GetYoutubeVideo = async (topic) => {
  if (!topic) return [];

  try {
    const params = {
      part: "snippet",
      q: topic,
      maxResults: 3,
      type: "video",
      key: process.env.YOUTUBE_API_KEY,
    };

    const resp = await axios.get(YOUTUBE_BASE_URL, { params });

    const youtubeVideoListResp = resp.data.items;

    return youtubeVideoListResp.map((item) => ({
      videoId: item.id?.videoId,
      title: item.snippet?.title,
    }));
  } catch (err) {
    console.error("❌ YouTube API Error for topic:", topic, err);
    return [];
  }
};

// ✅ Main handler
export async function POST(req) {
  const { course, courseTitle, courseId } = await req.json();
  const chapters = course?.chapters;

  if (!Array.isArray(chapters)) {
    return NextResponse.json(
      { error: "Invalid or missing chapters data" },
      { status: 400 }
    );
  }

  const promises = chapters.map(async (chapter) => {
    const config = {
      thinkingConfig: { thinkingBudget: -1 },
      responseMimeType: "text/plain",
    };

    const model = "gemini-2.5-pro";
    const contents = [
      {
        role: "user",
        parts: [{ text: PROMPT + JSON.stringify(chapter) }],
      },
    ];

    try {
      const response = await ai.models.generateContent({
        model,
        config,
        contents,
      });

      const RawResp = response?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!RawResp) {
        return {
          chapterName: chapter.name || "Unknown Chapter",
          error: "Empty AI response",
        };
      }

      const parsed = safeJsonParse(RawResp);
      if (!parsed) {
        console.error("❌ Failed to parse JSON for:", chapter.name);
        return {
          chapterName: chapter.name || "Unknown Chapter",
          error: "Parsing failed",
        };
      }

      const chapterName = parsed.chapterName || chapter.name;
      const topicQuery = chapterName || parsed.topics?.[0]?.topic;
      const youtubeVideos = await GetYoutubeVideo(topicQuery);

      return {
        ...parsed,
        chapterName,
        youtubeVideos,
      };
    } catch (err) {
      console.error("❌ AI Request failed for:", chapter.name, err);
      return {
        chapterName: chapter.name || "Unknown Chapter",
        error: "AI request failed",
      };
    }
  });

  const CourseContent = await Promise.all(promises);

  // ✅ Update in DB
  try {
    const dbResp = await db
      .update(coursesTable)
      .set({
        courseContent: CourseContent,
      })
      .where(eq(coursesTable.cid, courseId));

    return NextResponse.json({
      courseId,
      courseName: courseTitle,
      CourseContent,
    });
  } catch (err) {
    console.error("❌ DB Update Error:", err);
    return NextResponse.json(
      { error: "Failed to update course content in DB" },
      { status: 500 }
    );
  }
}
