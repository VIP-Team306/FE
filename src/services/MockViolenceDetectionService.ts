export interface ViolenceDetectionResult {
  isViolent: boolean;
  confidence: number;
  message: string;
}

// סטטוסים אפשריים של בדיקת הסרטון
export enum DetectionStatus {
    IDLE = 'idle',
    UPLOADING = 'uploading',
    DETECTING = 'detecting',
    COMPLETED = 'completed',
    ERROR = 'error'
  }

export const MockViolenceDetectionService = {
  async detectViolence(videoFiles: File[]): Promise<ViolenceDetectionResult> {
    const processingTime = 2000 + Math.random() * 2000;

    return new Promise((resolve) => {
      setTimeout(() => {
        const isViolent = Math.random() > 0.5;
        const confidence = 0.7 + Math.random() * 0.25;

        resolve({
          isViolent,
          confidence,
          message: isViolent
            ? "אותרה אלימות בסרטון שהועלה"
            : "לא אותרה אלימות בסרטון שהועלה",
        });
      }, processingTime);
    });
  },
};
