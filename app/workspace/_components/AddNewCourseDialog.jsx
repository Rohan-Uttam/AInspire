import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sparkle, Loader2Icon } from "lucide-react";
import axios from "axios";

function AddNewCourseDialog({ children }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    includeVideo: false,
    noOfChapters: 1,
    level: "",
    category: "",
  });
  const router = useRouter();

  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onGenerate = async () => {
    console.log("Generating course with data:", formData);
    const courseId = uuidv4(); // Generate a unique course ID
    try{
    setLoading(true);
    const result = await axios.post("/api/generate-course-layout", {
      ...formData,
      courseId: courseId, // Include the generated course ID
    });

    if(result.data.resp=='limit exceed'){
      toast.warning('Please Subscribe To Plan!')
      router.push('/workspace/billing')
    }
    setLoading(false);
    router.push('/workspace/edit-course/' +  result.data?.courseId); // Redirect to the edit course page with the course ID
  }
  catch(e){
    setLoading
    console.log(e);
  }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Course Using AI</DialogTitle>
          <DialogDescription>
            Fill in the details below to generate a course outline.
          </DialogDescription>
        </DialogHeader>

        {/* ✅ Moved outside DialogDescription */}
        <div className="flex flex-col gap-4 mt-3">
          <div className="flex flex-col gap-2">
            <label>Course Name</label>
            <Input
              placeholder="Course Name"
              onChange={(event) =>
                onHandleInputChange("name", event.target.value)
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Course Description (Optional)</label>
            <Textarea
              placeholder="Course Description"
              onChange={(event) =>
                onHandleInputChange("description", event.target.value)
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Number of Chapters</label>
            <Input
              placeholder="No of Chapters"
              type="number"
              onChange={(event) =>
                onHandleInputChange("noOfChapters", event.target.value)
              }
            />
          </div>
          <div className="flex items-center gap-3">
            <label>Include Video</label>
            <Switch
              checked={formData.includeVideo}
              onCheckedChange={() =>
                onHandleInputChange("includeVideo", !formData.includeVideo)
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Difficulty level</label>
            <Select
              onValueChange={(value) => onHandleInputChange("level", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Difficulty Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label>Category</label>
            <Input
              placeholder="Category (Separated by comma)"
              onChange={(event) =>
                onHandleInputChange("category", event.target.value)
              }
            />
          </div>
          <div className="mt-5">
            <Button className="w-full" onClick={onGenerate} disabled={loading}>
              {loading ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <Sparkle className="mr-2 h-4 w-4" />
              )}
              Generate Course
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewCourseDialog;
