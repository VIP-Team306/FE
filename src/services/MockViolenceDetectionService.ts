export interface ViolenceDetectionResult {
  isViolent: boolean;
  confidence: number;
}

export const resultsToastMessages = {
  violent: "אותרה אלימות בחלק מהסרטונים שהועלו",
  unviolent: "לא אותרה אלימות בסרטונים שהועלו",
} as const;

export const resultMessages = {
  violent: "אותרה אלימות בסרטון",
  unviolent: "לא אותרה אלימות בסרטון זה",
} as const;

// סטטוסים אפשריים של בדיקת הסרטון
export enum DetectionStatus {
  IDLE = "idle",
  UPLOADING = "uploading",
  DETECTING = "detecting",
  COMPLETED = "completed",
  ERROR = "error",
}

export const MockViolenceDetectionService = {
  async detectViolence(videoFiles: File[]): Promise<ViolenceDetectionResult[]> {
    const processingTime = 2000 + Math.random() * 2000;

    return new Promise((resolve) => {
      setTimeout(() => {
        const results = videoFiles.map((_) => {
          const isViolent = Math.random() > 0.5;
          const confidence = 0.7 + Math.random() * 0.25;
          return {
            isViolent,
            confidence,
          };
        });

        resolve(results);
      }, processingTime);
    });
  },
};
