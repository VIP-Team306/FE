export interface ViolenceDetectionResult {
  isViolent: boolean;
  confidence: number;
  previewUrl: string;
  startTime: number;
}

export const resultsToastMessages = {
  violent: "Violence was detected in some of the uploaded videos",
  unviolent: "No violence was detected in the uploaded videos",
} as const;

export const resultMessages = {
  violent: "Violence was detected in the video",
  unviolent: "No violence was detected in this video",
} as const;

export enum DetectionStatus {
  IDLE = "idle",
  UPLOADING = "uploading",
  DETECTING = "detecting",
  COMPLETED = "completed",
  ERROR = "error",
}

export const MockViolenceDetectionService = {
  async detectViolence(
    videoFiles: File[],
    previewUrls: string[]
  ): Promise<ViolenceDetectionResult[]> {
    const processingTime = 2000 + Math.random() * 2000;

    return new Promise((resolve) => {
      setTimeout(() => {
        const results = videoFiles.map((_, index) => {
          const isViolent = Math.random() > 0.5;
          const confidence = 0.7 + Math.random() * 0.25;
          return {
            isViolent,
            confidence,
            previewUrl: previewUrls[index],
          };
        });

        resolve(results);
      }, processingTime);
    });
  },
};
