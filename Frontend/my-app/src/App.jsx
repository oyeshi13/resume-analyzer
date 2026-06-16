import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import FileUploadZone from './components/FileUploadZone';
import './App.css';
import FilePreview from './components/FilePreview';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [viewingFile, setViewingFile] = useState(null);
  const [documentIds,setDocumentIds]=useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! Upload your resume, and I can help you analyze it, extract keywords, or optimize it for specific job descriptions.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleFilesSelected = async (files) => {
    const fileArray = Array.from(files).map(file => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type,
      rawFile: file
    }));
    setUploadedFiles((prev) => [...prev, ...fileArray]);

    const formData = new FormData()
      fileArray.forEach((file)=>{
        formData.append("files",file.rawFile)
      })
      const response= await fetch("http://localhost:5000/upload",{
        method: "POST",
        body: formData
      })

      const id =await response.json()
      console.log(id)
      setDocumentIds(prev => [...prev,...id.ids])
  };

  const handleRemoveFile = async (indexToRemove) => {
    const file = uploadedFiles[indexToRemove]
    const fileIndex= documentIds[indexToRemove]
    
    await fetch("http://localhost:5000/delete",{
      method:"DELETE",
      body:fileIndex
    })

    setUploadedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setDocumentIds((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSendMessage = async (text) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMessage]);
    // const formData =  new FormData()
    // if(documentIds.length){
    //   documentIds.forEach((id)=>
    //     formData.append("ids",id)
    //   )
    // }

    // formData.append("prompt",text)
    setIsAnalyzing(true)
    let response= await fetch("http://localhost:5000/ai-chat",{
        method:"POST",
        headers: {
    "Content-Type":"application/json"
  },
        body:JSON.stringify({
          docIds:documentIds,
          prompt:text
        })
      })
    
    setIsAnalyzing(false)
    const data = await response.json()
    //setDocuments(data.docs)
    //setDocuments((prev)=> [...prev,data.docs])
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
          <ChatInterface messages={messages} onSendMessage={handleSendMessage} isAnalyzing={isAnalyzing} />
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