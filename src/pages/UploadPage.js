import React, { useState } from 'react';
import styles from '../styles/UploadVideo.module.css';  // Adjust the path if needed

const VideoUpload = () => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideo(file);
    }
  };

  const handleUpload = async () => {
    if (!video) return;
    setLoading(true);

    // Mock API call (Replace with actual API request when backend is ready)
    setTimeout(() => {
      console.log('Video uploaded:', video.name);
      alert('Video uploaded successfully! (Mock response)');
      setLoading(false);
    }, 2000);
  };

  return (
    <div className={styles.uploadContainer}>
      <h2>העלאת סרטונים לבדיקה</h2>
      <div className={styles.uploadBox}>
        <input type="file" accept="video/*" onChange={handleFileChange} className={styles.inputFile} />
        <p>{video ? video.name : 'גרור או העלה סרטון לבדיקה'}</p>
      </div>
      <button className={styles.uploadButton} onClick={handleUpload} disabled={!video || loading}>
        {loading ? 'טוען...' : 'בדיקת הסרטון'}
      </button>
    </div>
  );
};

export default VideoUpload;