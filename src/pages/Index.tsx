import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoUploader from "@/components/VideoUploader";
import ResultDisplay from "@/components/ResultDisplay";
import {
  ViolenceDetectionResult,
  DetectionStatus,
  MockViolenceDetectionService,
  resultsToastMessages,
} from "@/services/MockViolenceDetectionService"; // Correct import
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import CameraIcon from "@/assets/vip-camera1.png";
import { BACKEAND_URL } from "@/config";
import { Upload, ClipboardList } from "lucide-react";

//TODO: delete
const MOCK_RESULTS = [
  {
    file_name: "20250422_233246.mp4",
    violence_score: 0.9,
  },
  {
    file_name: "20250425_145458.mp4",
    violence_score: 0.15,
  },
  {
    file_name: "VID-20250417-WA0025.mp4",
    violence_score: 0.55,
  },
];
const backEndInstance = axios.create({
  baseURL: BACKEAND_URL,
});

const requestPrediction = async (selectedVideos: File[]) => {
  const formData = new FormData();
  selectedVideos.forEach((video) => {
    formData.append("files", video);
  });
  const response = await backEndInstance.post("predict", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  // return response.data.results;
  return MOCK_RESULTS;
};

const detect = async (
  selectedVideos: File[],
  previewUrls: string[]
): Promise<ViolenceDetectionResult[]> => {
  const predictions = await requestPrediction(selectedVideos);
  return selectedVideos.map((_, index) => {
    const prediction = predictions[index].violence_score;
    return {
      isViolent: prediction > 0.5,
      confidence: Math.abs(prediction - 0.5) * 2,
      previewUrl: previewUrls[index],
    };
  });
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedVideos, setSelectedVideos] = useState<File[] | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[] | null>(null);
  const [detectionStatus, setDetectionStatus] = useState<DetectionStatus>(
    DetectionStatus.IDLE
  );
  const [detectionResult, setDetectionResult] = useState<
    ViolenceDetectionResult[] | null
  >(null);
  const { toast } = useToast();

  const handleVideoSelected = (file: File[]) => {
    setSelectedVideos(file);
    setDetectionResult(null);
  };

  const handleCheckVideo = async () => {
    if (!selectedVideos) {
      toast({
        variant: "destructive",
        title: "לא נבחר סרטון",
        description: "אנא בחר סרטון לבדיקה",
      });
      return;
    }

    try {
      setDetectionStatus(DetectionStatus.UPLOADING);
      toast({
        title: "מעלה סרטון",
        description: "מתחיל בתהליך העלאת הסרטון לשרת",
      });

      setDetectionStatus(DetectionStatus.DETECTING);
      toast({
        title: "בדיקת סרטון",
        description: "מערכת הבינה המלאכותית מנתחת את תוכן הסרטון",
      });

      const results = await detect(selectedVideos, previewUrls);

      setDetectionResult(results);
      setDetectionStatus(DetectionStatus.COMPLETED);
      setActiveTab("results");
      toast(
        results.some((result) => result.isViolent)
          ? {
              variant: "destructive",
              title: "הבדיקה הושלמה",
              description: resultsToastMessages.violent,
            }
          : {
              variant: "default",
              title: "הבדיקה הושלמה",
              description: resultsToastMessages.unviolent,
            }
      );
    } catch (error) {
      console.error("Error during violence detection:", error);
      setDetectionStatus(DetectionStatus.ERROR);

      toast({
        variant: "destructive",
        title: "שגיאה בתהליך הבדיקה",
        description: "אירעה שגיאה בעת בדיקת הסרטון, אנא נסה שנית",
      });
    }
  };

  const handleReset = () => {
    setPreviewUrls(null);
    setSelectedVideos(null);
    setDetectionResult(null);
    setDetectionStatus(DetectionStatus.IDLE);
    setActiveTab("upload");
  };

  const isProcessing =
    detectionStatus === DetectionStatus.UPLOADING ||
    detectionStatus === DetectionStatus.DETECTING;

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.05),rgba(255,255,255,0.3)),url('/blue-poster.png')] py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-[0px_3px_10px_rgba(0,0,0,0.3)] opacity-100 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
          <div className="mt-4 md:mt-0 h-[80px] w-[80px]">
            <img src={CameraIcon} />
          </div>
          <div className="pr-4">
            <h1 className="text-3xl font-bold mb-2">
              ברוכים הבאים למערכת לבדיקת אלימות בסרטונים
            </h1>
            <p className="text-gray-600">
              יחד נוריד את שיעור האלימות במרחב הציבורי
            </p>
          </div>
        </div>

        <div className="w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger
                value="upload"
                className={activeTab === "upload" ? "tab-active" : ""}
              >
                העלאת סרטונים לבדיקה
                <Upload className="h-4 w-4 ml-2" />
              </TabsTrigger>
              <TabsTrigger
                value="results"
                className={activeTab === "results" ? "tab-active" : ""}
                disabled={detectionStatus !== DetectionStatus.COMPLETED}
              >
                תוצאות בדיקה
                <ClipboardList className="h-4 w-4 ml-2" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <VideoUploader
                onVideoSelected={handleVideoSelected}
                selectedVideos={selectedVideos}
                previewUrls={previewUrls}
                setPreviewUrls={setPreviewUrls}
                isProcessing={isProcessing}
              />

              <div className="flex justify-center mt-8 gap-4">
                <button
                  className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCheckVideo}
                  disabled={!selectedVideos || isProcessing}
                >
                  בדיקת הסרטון
                </button>

                <button
                  className="px-5 py-2 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={handleReset}
                  disabled={!selectedVideos || isProcessing}
                >
                  ביטול
                </button>
              </div>
            </TabsContent>

            <TabsContent value="results">
              <ResultDisplay
                results={detectionResult}
                isLoading={isProcessing}
                onReset={handleReset}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
