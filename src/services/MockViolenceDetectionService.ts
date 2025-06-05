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
  async detectViolence(videoFiles: File[]) {
    const processingTime = 2000 + Math.random() * 2000;

    return new Promise((resolve) => {
      setTimeout(() => {
        const results = videoFiles.map((file) => ({
          file_name: `${file.name}-Mock`,
          violence_score: Math.random(),
          start_time: `${Math.random() * 10}`.slice(0, 4),
        }));

        resolve(results);
      }, processingTime);
    });
  },
};

export const MOCK_RESULTS = [
  {
    file_name: "20250422_233246.mp4",
    violence_score: 0.9,
    start_time: 5,
  },
  {
    file_name: "20250425_145458.mp4",
    violence_score: 0.15,
    start_time: 3.2,
  },
  {
    file_name: "VID-20250417-WA0025.mp4",
    violence_score: 0.55,
    start_time: 2.5,
  },
  {
    file_name: "20250422_233246.mp4",
    violence_score: 0.9,
    start_time: 5.6,
  },
  {
    file_name: "20250425_145458.mp4",
    violence_score: 0.15,
    start_time: 5.6,
  },
  {
    file_name: "VID-20250417-WA0025.mp4",
    violence_score: 0.55,
    start_time: 5.6,
  },
  {
    file_name: "20250422_233246.mp4",
    violence_score: 0.9,
    start_time: 5.6,
  },
  {
    file_name: "20250425_145458.mp4",
    violence_score: 0.15,
    start_time: 5.6,
  },
  {
    file_name: "VID-20250417-WA0025.mp4",
    violence_score: 0.55,
    start_time: 5.6,
  },
  {
    file_name: "20250425_145458.mp4",
    violence_score: 0.15,
    start_time: 5.6,
  },
  {
    file_name: "VID-20250417-WA0025.mp4",
    violence_score: 0.55,
    start_time: 5.6,
  },
  {
    file_name: "20250425_145458.mp4",
    violence_score: 0.15,
    start_time: 5.6,
  },
  {
    file_name: "VID-20250417-WA0025.mp4",
    violence_score: 0.55,
    start_time: 5.6,
  },
  {
    file_name: "20250425_145458.mp4",
    violence_score: 0.15,
    start_time: 5.6,
  },
  {
    file_name: "VID-20250417-WA0025.mp4",
    violence_score: 0.55,
    start_time: 5.6,
  },
];
