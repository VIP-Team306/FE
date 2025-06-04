import {
  resultMessages,
  ViolenceDetectionResult as ViolenceDetectionResults,
} from "@/services/MockViolenceDetectionService";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ResultDisplayProps {
  results: ViolenceDetectionResults[] | null;
  isLoading: boolean;
  onReset: () => void;
}

const ResultDisplay = ({ results, isLoading, onReset }: ResultDisplayProps) => {
  const [showViolent, setShowViolent] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-md shadow-sm border border-gray-200">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
        <h3 className="text-lg font-semibold">Checking the video...</h3>
        <p className="text-gray-500 text-sm mb-2">
          The artificial intelligence system analyzes the content of the video
        </p>
        <div className="w-full h-full max-w-md bg-gray-200 rounded-full h-2 mt-4">
          <div
            className="bg-[#233964] h-2 rounded-full animate-pulse-blue"
            style={{ width: "100%" }}
          ></div>
        </div>
      </div>
    );
  }

  if (!results?.length) return null;

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className={`px-6 py-0 rounded-md shadow-sm flex flex-col items-center text-center `}
    >
      <div className="flex flex-row items-center self-start">
        <button
          onClick={() => setShowViolent(!showViolent)}
          className={`relative inline-flex h-6 w-11 mr-3 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            showViolent
              ? "bg-red-600 focus:ring-red-500"
              : "bg-gray-300 focus:ring-[#233964]"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              showViolent ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>

        <span
          className={`text-sm font-semibold ${
            showViolent ? "text-red-600" : "text-gray-600"
          }`}
        >
          {"Show Only Violent Videos"}
        </span>
      </div>
      <div className="max-h-[50vh] overflow-y-auto w-[100%] my-5">
        {results
          .filter((result) => !showViolent || result.isViolent)
          .map((result) => (
            <div
              dir="ltr"
              className={`grid grid-cols-[20%_60%_20%] gap-4 pt-5 my-4 w-[99%]
          ${
            result.isViolent
              ? "bg-red-50 border border-red-200"
              : "bg-green-50 border border-green-200"
          }
        }`}
            >
              <div className="max-h-[180px] max-w-[180px] flex justify-center items-center">
                <video
                  src={result.previewUrl || undefined}
                  controls
                  className="h-[90%]"
                />
              </div>
              <div className={`flex flex-col items-center text-center`}>
                {result.isViolent ? (
                  <div className="mb-4 p-3 bg-red-100 rounded-full">
                    <AlertTriangle className="h-10 w-10 text-red-500" />
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-green-100 rounded-full">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                )}

                <h3
                  className={`text-xl font-bold mb-2 ${
                    result.isViolent ? "text-red-700" : "text-green-700"
                  }`}
                >
                  {result.isViolent
                    ? resultMessages.violent
                    : resultMessages.unviolent}
                </h3>

                <p className="text-gray-600 mb-4">
                  Confidence level: {Math.round(result.confidence * 100)}%
                </p>

                <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-6">
                  <div
                    className={`h-2.5 rounded-full ${
                      result.isViolent ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <Button onClick={onReset} variant="outline" className="mt-2">
        Start Over With More Videos
      </Button>
    </motion.div>
  );
};

export default ResultDisplay;
