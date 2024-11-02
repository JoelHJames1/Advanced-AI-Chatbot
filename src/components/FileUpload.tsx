import React, { useState } from 'react';
import { FileUp, X } from 'lucide-react';
import { read as readXLSX, utils as xlsxUtils } from 'xlsx';
import mammoth from 'mammoth';

interface FileUploadProps {
  onFileContent: (content: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileContent }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const readExcelFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = readXLSX(data);
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = xlsxUtils.sheet_to_json(sheet);
          resolve(JSON.stringify(jsonData, null, 2));
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const readWordFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (files.length + newFiles.length > 5) {
      alert('Maximum 5 files allowed');
      return;
    }
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    setLoading(true);
    try {
      const contents: string[] = [];
      
      for (const file of files) {
        let content = '';
        
        if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.ms-excel') {
          content = await readExcelFile(file);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                   file.type === 'application/msword') {
          content = await readWordFile(file);
        } else {
          content = await readTextFile(file);
        }
        
        contents.push(`File: ${file.name}\n\nContent:\n${content}\n---`);
      }
      
      onFileContent(contents.join('\n\n'));
      setFiles([]);
    } catch (error) {
      console.error('Error processing files:', error);
      alert('Error processing files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.doc,.docx,.xls,.xlsx,.pdf"
          />
          <div className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
            <FileUp size={20} />
            <span>Upload Files</span>
          </div>
        </label>
        {files.length > 0 && (
          <button
            onClick={processFiles}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Process Files'}
          </button>
        )}
      </div>
      
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span className="truncate">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};