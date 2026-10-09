import React, { useState } from 'react';
import { uploadDocument } from '../lib/api';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setSuccess(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await uploadDocument(formData);
      setSuccess(true);
      setFile(null);
    } catch (err) {
      alert('Error local al procesar el archivo. Revisa el tamaño y formato.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4 text-center">
              <h3 className="fw-bold text-primary mb-3">📁 Carga de Documentos</h3>
              <p className="text-muted mb-4">Sube archivos PDF, TXT o CSV para indexar en tu ChromaDB local</p>

              <form onSubmit={handleUpload}>
                <div className="mb-4 p-4 border border-dashed rounded bg-light">
                  <input 
                    type="file" 
                    className="form-control" 
                    id="fileInput"
                    accept=".pdf,.txt,.csv,.xlsx"
                    onChange={handleFileChange}
                  />
                  <div className="form-text mt-2">Formatos soportados: PDF, TXT, CSV, Excel. Máx 25MB.</div>
                </div>

                {file && (
                  <div className="alert alert-info py-2" role="alert">
                    Archivo seleccionado: <strong>{file.name}</strong>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success py-2" role="alert">
                    ¡Documento indexado con éxito en el Vector Store!
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 btn-lg" 
                  disabled={!file || uploading}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Indexando y segmentando texto...
                    </>
                  ) : 'Subir e Indexar'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
