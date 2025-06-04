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
import CameraIcon from "@/assets/logo_without_backgr.png";
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
  {
    file_name: "20250425_145458.mp4",
    violence_score: 0.15,
  },
  {
    file_name: "VID-20250417-WA0025.mp4",
    violence_score: 0.55,
  },
  {
    file_name: "20250425_145458.mp4",
    violence_score: 0.15,
  },
  {
    file_name: "VID-20250417-WA0025.mp4",
    violence_score: 0.55,
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
        title: "No video selected",
        description: "please select some videos",
      });
      return;
    }

    try {
      setDetectionStatus(DetectionStatus.UPLOADING);
      toast({
        title: "Uploading videos",
        description: "starting the upload-video process",
      });

      setDetectionStatus(DetectionStatus.DETECTING);
      toast({
        title: "Starting detaction",
        description:
          "The artificial intelligence system analyzes the content of the video",
      });

      const results = await detect(selectedVideos, previewUrls);

      setDetectionResult(results);
      setDetectionStatus(DetectionStatus.COMPLETED);
      setActiveTab("results");
      toast({
        variant: "default",
        title: "detection completed",
        description: results.some((result) => result.isViolent)
          ? resultsToastMessages.violent
          : resultsToastMessages.unviolent,
      });
    } catch (error) {
      console.error("Error during violence detection:", error);
      setDetectionStatus(DetectionStatus.ERROR);

      toast({
        variant: "destructive",
        title: "Error in detection process",
        description:
          "An error occurred while checking the video, please try again",
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
        <div className="flex flex-col md:flex-row items-start md:items-center content-center mb-8 h-[80px]">
          <div className="mt-4 md:mt-0 h-[100%]">
            <img src={CameraIcon} className="h-[100%]" />
          </div>
          <div className="pl-2">
            <h1 className="text-3xl font-bold">
              Welcome to the violence detection system in videos
            </h1>
            <p className="text-gray-600">
              Together we will reduce the level of violence in public spaces
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
                <Upload className="h-4 w-4 mr-1" />
                Uploading Videos for Review
              </TabsTrigger>
              <TabsTrigger
                value="results"
                className={activeTab === "results" ? "tab-active" : ""}
                disabled={detectionStatus !== DetectionStatus.COMPLETED}
              >
                <ClipboardList className="h-4 w-4 mr-1" />
                Test Results
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
                  className="px-5 py-2 bg-[#233964] text-white rounded-md hover:bg-[#00142d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCheckVideo}
                  disabled={!selectedVideos || isProcessing}
                >
                  Start Detection
                </button>

                <button
                  className="px-5 py-2 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={handleReset}
                  disabled={!selectedVideos || isProcessing}
                >
                  Cancel
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
