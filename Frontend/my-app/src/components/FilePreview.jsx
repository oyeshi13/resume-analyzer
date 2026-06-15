import React, { useState, useEffect } from 'react';

function FilePreview({ file, onClose }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!file || !file.rawFile) return;

    // Generate a temporary browser URL to display the file
    const objectUrl = URL.createObjectURL(file.rawFile);
    setPreviewUrl(objectUrl);

    // Cleanup the URL to prevent memory leaks when the component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!file) return null;

  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf';

  return (
    <div className="file-preview-overlay" onClick={onClose}>
      <div className="file-preview-modal" onClick={(e) => e.stopPropagation()}>
        <header className="file-preview-header">
          <h3>{file.name}</h3>
          <button onClick={onClose} className="close-preview-btn">✕</button>
        </header>
        
        <div className="file-preview-content">
          {isImage && <img src={previewUrl} alt={file.name} className="preview-media image" />}
          {isPdf && <iframe src={previewUrl} title={file.name} className="preview-media pdf" />}
          {!isImage && !isPdf && (
            <div className="preview-unsupported">
              <p>Preview not available for this file type.</p>
              <span className="file-badge">{file.type || 'Unknown Format'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilePreview;