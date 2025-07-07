import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { auth ,currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import axios from "axios";
import { eq } from "drizzle-orm";

const PROMPT = `Generate Learning Course depends on following details. In which Make sure to add Course Name, Description,Course Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format Chapter Name, , Topic under each chapters , Duration for each chapters etc, in JSON format only

Schema:

{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": "boolean",
    "noOfChapters": "number",

"bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": [
          "string"
        ],
     
      }
    ]
  }
}

, User Input: 
`;
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
export async function POST(req) {
  const { courseId, ...formData } = await req.json();
  const user = await currentUser();
  const { has } = await auth();
  const hasPremiumAccess = has({ plan: "starter" });
  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    responseMimeType: "text/plain",
  };

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: PROMPT + JSON.stringify(formData),
        },
      ],
    },
  ];

  const model = "gemini-2.5-pro";
 if(!hasPremiumAccess){
  const result = await db.select().from(coursesTable)
  .where(eq(coursesTable.userEmail,user?.primaryEmailAddress.emailAddress));
   if(result?.length>=1){
    return NextResponse.json({'resp':'limit exceed'})
   }


 }
  const response = await ai.models.generateContent({
    model,
    config,
    contents,
  });

  console.log(response.candidates[0].content.parts[0].text);
  const RawResp = response?.candidates[0]?.content?.parts[0]?.text;
  const RawJson = RawResp.replace(/```json|```/g, "").trim();

  const JSONResp = JSON.parse(RawJson);
  const ImagePrompt = JSONResp.course?.bannerImagePrompt;

  const bannerImageUrl = await GenerateImage(ImagePrompt);

  // SAVE TO DB
  const result = await db.insert(coursesTable).values({
    ...formData,
    courseJson: JSONResp,
    userEmail: user?.primaryEmailAddress?.emailAddress,
    cid: courseId,
    bannerImageUrl: bannerImageUrl,
  });

  return NextResponse.json({ courseId: courseId });
}

const GenerateImage = async (imagePrompt) => {
  const BASE_URL = "https://aigurulab.tech";
  const result = await axios.post(
    BASE_URL + "/api/generate-image",
    {
      width: 1024,
      height: 1024,
      input: imagePrompt, //Input Prompt
      model: 'flux', //'flux'
      aspectRatio: "16:9", //Applicable to Flux model only
    },
    {
      headers: {
        "x-api-key": process?.env?.AI_GURU_LAB_API, // Your API Key
        "Content-Type": "application/json", // Content Type
      },
    }
  );
  console.log(result.data.image);
  return result.data.image;
  //Output Result: Base 64 Image
};
