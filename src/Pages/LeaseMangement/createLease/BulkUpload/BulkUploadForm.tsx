import React, { useState } from "react";
import { Upload, File, X, Check, AlertCircle } from "lucide-react";

const BulkUploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is CSV or Excel
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a CSV or Excel file");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size should not exceed 10MB");
      return;
    }

    setFile(file);

    // Simulate file upload
    setUploadStatus("uploading");
    setTimeout(() => {
      // Randomly succeed or fail for demo purposes
      setUploadStatus(Math.random() > 0.3 ? "success" : "error");
    }, 2000);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadStatus("idle");
  };

  const downloadTemplate = (format: "csv" | "excel") => {
    // In a real app, this would download the template
    alert(`Downloading ${format.toUpperCase()} template`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
   

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Upload Lease Data
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Upload your lease data in CSV or Excel format.
          </p>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 mb-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            {!file ? (
              <>
                <Upload size={40} className="text-blue-500 mb-4" />
                <p className="text-gray-700 font-medium mb-2">
                  Upload a file or drag & drop
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  CSV or Excel files up to 10MB
                </p>
                <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer transition-colors">
                  Choose Files
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </>
            ) : (
              <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <File size={24} className="text-blue-500 mr-3" />
                    <div>
                      <p className="text-gray-800 font-medium">{file.name}</p>
                      <p className="text-gray-500 text-sm">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="text-gray-500 hover:text-gray-700"
                    type="button"
                  >
                    <X size={18} />
                  </button>
                </div>

                {uploadStatus === "uploading" && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div className="bg-blue-600 h-2.5 rounded-full animate-progress"></div>
                  </div>
                )}

                {uploadStatus === "success" && (
                  <div className="flex items-center text-green-600">
                    <Check size={18} className="mr-2" />
                    <span>Upload successful</span>
                  </div>
                )}

                {uploadStatus === "error" && (
                  <div className="flex items-center text-red-600">
                    <AlertCircle size={18} className="mr-2" />
                    <span>Upload failed. Please try again.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Instructions
          </h3>

          <ol className="space-y-6">
            <li>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                  1
                </span>
                <div>
                  <p className="font-medium text-gray-800">
                    Download the template
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => downloadTemplate("csv")}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm flex items-center hover:bg-gray-50"
                      type="button"
                    >
                      CSV Template
                    </button>
                    <button
                      onClick={() => downloadTemplate("excel")}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm flex items-center hover:bg-gray-50"
                      type="button"
                    >
                      Excel Template
                    </button>
                  </div>
                </div>
              </div>
            </li>

            <li>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                  2
                </span>
                <div>
                  <p className="font-medium text-gray-800">
                    Fill in your lease data
                  </p>
                  <ul className="mt-2 space-y-1 text-gray-600 text-sm">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                      Follow the template format exactly
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                      Do not remove column headers
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                      Use YYYY-MM-DD date format
                    </li>
                  </ul>
                </div>
              </div>
            </li>

            <li>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                  3
                </span>
                <div>
                  <p className="font-medium text-gray-800">
                    Upload and validate
                  </p>
                  <p className="mt-1 text-gray-600 text-sm">
                    The system will validate your data before importing. Fix any
                    validation errors and re-upload if needed.
                  </p>
                </div>
              </div>
            </li>

            <li>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                  4
                </span>
                <div>
                  <p className="font-medium text-gray-800">
                    Review imported leases
                  </p>
                  <p className="mt-1 text-gray-600 text-sm">
                    After successful upload, review the imported leases to
                    ensure accuracy.
                  </p>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadForm;
