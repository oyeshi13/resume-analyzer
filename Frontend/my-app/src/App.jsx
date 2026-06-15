import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import FileUploadZone from './components/FileUploadZone';
import './App.css';
import FilePreview from './components/FilePreview';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [viewingFile, setViewingFile] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! Upload your resume, and I can help you analyze it, extract keywords, or optimize it for specific job descriptions.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleFilesSelected = (files) => {
    const fileArray = Array.from(files).map(file => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type,
      rawFile: file
    }));
    setUploadedFiles((prev) => [...prev, ...fileArray]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setUploadedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSendMessage = async (text) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    let response
    if(uploadedFiles.length){
      const formData = new FormData()
      uploadedFiles.forEach((file)=>{
        formData.append("files",file.rawFile)
      })
      formData.append("prompt",text)
      response= await fetch("http://localhost:5000/analyze-resume",{
        method: "POST",
        body: formData
      })
    }
    else{
        response = await fetch('http://localhost:5000/chat',{
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          "message" : text
        })
      })    
    }
    const data = await response.json()
      const assistantMessage = {
      id : Date.now().toString(),
      role: "assistant",
      content : data.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages((prev) => [...prev, assistantMessage]);
  };

  

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Resume AI Analyzer</h1>
        <p>Upload resumes and query AI for immediate feedback, ATS scoring, and optimization suggestions.</p>
      </header>

      <main className="app-main">
        <section className="sidebar-section">
          <h2>Documents</h2>
          <FileUploadZone onFilesSelected={handleFilesSelected} />
          
          <div className="file-list">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="file-item">
                {/* Updated onClick handler to open the preview */}
                <div className="file-info" onClick={() => setViewingFile(file)} style={{cursor: 'pointer'}}>
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{file.size}</span>
                </div>
                <button className="remove-file-btn" onClick={() => handleRemoveFile(index)}>×</button>
              </div>
            ))}
          </div>
        </section>

        <section className="chat-section">
          <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
        </section>
      </main>

      {/* --- ADD IT RIGHT HERE --- */}
      {viewingFile && (
        <FilePreview file={viewingFile} onClose={() => setViewingFile(null)} />
      )}

    </div>
  );
}

export default App;