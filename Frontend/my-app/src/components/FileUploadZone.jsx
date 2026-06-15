import React, { useState } from 'react';

function FileUploadZone({ onFilesSelected }) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <div 
      className={`upload-zone ${isDragActive ? 'active' : ''}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        id="file-upload-input" 
        multiple 
        onChange={handleChange} 
        style={{ display: 'none' }} 
      />
      <label htmlFor="file-upload-input" className="upload-label">
        <p>Drag & drop any resume file here, or <strong>browse</strong></p>
        <span className="file-types-hint">Supports PDF, DOCX, TXT, images</span>
      </label>
    </div>
  );
}

export default FileUploadZone;