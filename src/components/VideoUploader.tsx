import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { MockViolenceDetectionService } from "@/services/MockViolenceDetectionService";

interface VideoUploaderProps {
  onVideoSelected: (files: File[]) => void;
  isProcessing: boolean;
  selectedVideos: File[];
  previewUrls: string[] | null;
  setPreviewUrls: (value: string[] | null) => void;
}

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB
const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

const VideoUploader = ({
  onVideoSelected,
  isProcessing,
  previewUrls,
  selectedVideos,
  setPreviewUrls,
}: VideoUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "סוג קובץ לא נתמך",
        description: "אנא העלה קובץ וידאו בפורמט MP4, WebM, OGG או MOV",
      });
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: "destructive",
        title: "קובץ גדול מדי",
        description: "גודל הקובץ המקסימלי הוא 1GB",
      });
      return false;
    }
    return true;
  };

  const handleVideoSelection = (files: File[]) => {
    files.forEach((file) => {
      if (!validateFile(file)) return;
    });

    onVideoSelected(files);

    const videoUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(videoUrls);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleVideoSelection([...e.dataTransfer.files]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      handleVideoSelection([...e.target.files]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeSelectedVideo = (videoIndex: number) => {
    const newSelectedVideos = [...selectedVideos];
    const newPreviewUrls = [...previewUrls];
    newSelectedVideos.splice(videoIndex, 1);
    newPreviewUrls.splice(videoIndex, 1);
    onVideoSelected(newSelectedVideos);
    setPreviewUrls(newPreviewUrls);
    if (fileInputRef.current && !selectedVideos.length)
      fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!selectedVideos) return;

    try {
      await MockViolenceDetectionService.detectViolence(selectedVideos);
    } catch (error) {
      console.error("Error during upload:", error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "שגיאה ברשת.",
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="video/*"
        onChange={handleChange}
        className="hidden"
        disabled={isProcessing}
      />
      {!selectedVideos?.length ? (
        <div
          className={`upload-area ${
            dragActive ? "dragging" : ""
          } hover:bg-gray-100`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <div className="flex flex-col items-center justify-center">
            <Plus className="h-12 w-12 text-blue-500 mb-4" />
            <p className="text-lg font-medium mb-1">
              גרור או העלה סרטון לבדיקה
            </p>
            <p className="text-sm text-gray-500 mb-4" dir="rtl">
              תומך בקבצי MP4, WebM, OGG, MOV עד 1GB
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center"
              disabled={isProcessing}
              onClick={handleUpload}
            >
              <Upload className="h-4 w-4 ml-2" />
              <span>העלה סרטון</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative rounded-md overflow-auto h-[70vh] border border-gray-200">
          {previewUrls.map((previewUrl, index) => (
            <>
              {!isProcessing && (
                <button
                  className="absolute mt-2 right-2 p-1 bg-gray-800 bg-opacity-60 rounded-full text-white z-10"
                  onClick={() => removeSelectedVideo(index)}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              <video
                src={previewUrl || undefined}
                controls
                className="w-full max-h-[500px]"
              />
              <div className="p-3 bg-white border-t border-gray-200">
                <p
                  className="font-medium text-sm truncate"
                  title={selectedVideos[index]?.name}
                >
                  {selectedVideos[index]?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedVideos[index]?.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <hr />
            </>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
