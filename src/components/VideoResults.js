import React from "react";
import styles from "./VideoResults.module.css";

const VideoResults = () => {
  const mockResults = [
    { id: 1, name: "Video 1", status: "Processed", detected: "No Violence" },
    { id: 2, name: "Video 2", status: "Processing", detected: "-" },
    { id: 3, name: "Video 3", status: "Processed", detected: "Violence Detected" },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Video Analysis Results</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Video Name</th>
            <th>Status</th>
            <th>Detection</th>
          </tr>
        </thead>
        <tbody>
          {mockResults.map((video) => (
            <tr key={video.id}>
              <td>{video.name}</td>
              <td>{video.status}</td>
              <td>{video.detected}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VideoResults;
