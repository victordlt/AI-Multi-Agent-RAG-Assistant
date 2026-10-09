import React, { useState, useRef } from 'react';

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  loading: boolean;
}

export default function UploadZone({ onFileSelected, loading }: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejar cuando un archivo es arrastrado sobre la zona
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  // Manejar cuando el archivo se suelta en la zona
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  // Manejar la selección tradicional mediante el botón de explorador
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={`p-5 border border-2 border-dashed rounded text-center transition-all ${
        isDragActive ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary bg-light'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      style={{ cursor: loading ? 'not-allowed' : 'pointer', transition: '0.2s' }}
    >
      {/* Input de tipo file oculto, controlado por el botón de Bootstrap */}
      <input
        ref={fileInputRef}
        type="file"
        className="d-none"
        accept=".pdf,.txt,.csv"
        onChange={handleFileInput}
        disabled={loading}
      />

      <div className="py-4">
        {/* Icono grande simulado con emojis o fuentes */}
        <div className="display-4 text-primary mb-3">
          {loading ? '⏳' : '📥'}
        </div>
        
        {loading ? (
          <div>
            <h5 className="fw-bold text-secondary">Procesando documento...</h5>
            <p className="text-muted small mb-0">
              El servidor local está extrayendo el texto y generando embeddings con Llama 3
            </p>
          </div>
        ) : (
          <div>
            <h5 className="fw-bold mb-2">Arrastra y suelta tu archivo aquí</h5>
            <p className="text-muted small mb-3">Soporta formatos PDF, TXT y CSV (Máx. 25MB)</p>
            
            <button 
              type="button" 
              className="btn btn-outline-primary px-4" 
              onClick={onButtonClick}
            >
              Examinar archivos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
