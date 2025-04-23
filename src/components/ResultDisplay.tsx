
import { ViolenceDetectionResult } from "@/services/violenceDetectionService";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ResultDisplayProps {
  result: ViolenceDetectionResult | null;
  isLoading: boolean;
  onReset: () => void;
}

const ResultDisplay = ({ result, isLoading, onReset }: ResultDisplayProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-md shadow-sm border border-gray-200">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
        <h3 className="text-lg font-semibold">בודק את הסרטון...</h3>
        <p className="text-gray-500 text-sm mb-2">מערכת הבינה המלאכותית מנתחת את תוכן הסרטון</p>
        <div className="w-full max-w-md bg-gray-200 rounded-full h-2 mt-4">
          <div className="bg-blue-500 h-2 rounded-full animate-pulse-blue" style={{ width: '100%' }}></div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className={`p-6 rounded-md shadow-sm ${
        result.isViolent ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
      }`}
    >
      <div className="flex flex-col items-center text-center">
        {result.isViolent ? (
          <div className="mb-4 p-3 bg-red-100 rounded-full">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
        ) : (
          <div className="mb-4 p-3 bg-green-100 rounded-full">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        )}
        
        <h3 className={`text-xl font-bold mb-2 ${result.isViolent ? 'text-red-700' : 'text-green-700'}`}>
          {result.message}
        </h3>
        
        <p className="text-gray-600 mb-4">
          רמת ביטחון: {Math.round(result.confidence * 100)}%
        </p>
        
        <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-6">
          <div 
            className={`h-2.5 rounded-full ${result.isViolent ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${result.confidence * 100}%` }}
          ></div>
        </div>
        
        <Button onClick={onReset} variant="outline" className="mt-2">
          בדוק סרטון נוסף
        </Button>
      </div>
    </motion.div>
  );
};

export default ResultDisplay;
