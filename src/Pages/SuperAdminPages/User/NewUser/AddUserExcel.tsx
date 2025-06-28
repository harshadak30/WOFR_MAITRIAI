
import { UserPlus, X, Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useState, useRef } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import axios from "../../../../helper/axios";

interface UserData {
  name: string;
  email: string;
  row?: number;
  errors?: string[];
}

interface ValidationResult {
  valid: UserData[];
  invalid: UserData[];
}

type CSVUploadModalProps = {
  onClose: () => void;
  onSave?: (users: UserData[]) => void;
  modules?: any[];
};

const AddUserExcel: React.FC<CSVUploadModalProps> = ({
  onClose,

}) => {
  const { authState } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvData, setCsvData] = useState<UserData[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStep, setUploadStep] = useState<'upload' | 'preview' | 'result'>('upload');

  // Sample CSV template
  const downloadTemplate = () => {
    const csvContent = "name,email\nJohn Doe,john.doe@company.com\nJane Smith,jane.smith@company.com";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Parse CSV content
  const parseCSV = (text: string): UserData[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    
    const nameIndex = headers.findIndex(h => h.includes('name'));
    const emailIndex = headers.findIndex(h => h.includes('email'));
    
    if (nameIndex === -1 || emailIndex === -1) {
      throw new Error('CSV must contain "name" and "email" columns');
    }

    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      return {
        name: values[nameIndex] || '',
        email: values[emailIndex] || '',
        row: index + 2 
      };
    }).filter(user => user.name || user.email); 
  };

  // Validate users
  const validateUsers = (users: UserData[]): ValidationResult => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emails = new Set<string>();
    
    const valid: UserData[] = [];
    const invalid: UserData[] = [];

    users.forEach(user => {
      const errors: string[] = [];
      
      // Name validation
      if (!user.name.trim()) {
        errors.push('Name is required');
      } else if (!nameRegex.test(user.name)) {
        errors.push('Name should contain only letters and spaces');
      }
      
      // Email validation
      if (!user.email.trim()) {
        errors.push('Email is required');
      } else if (!emailRegex.test(user.email)) {
        errors.push('Invalid email format');
      } else if (emails.has(user.email.toLowerCase())) {
        errors.push('Duplicate email');
      } else {
        emails.add(user.email.toLowerCase());
      }
      
      if (errors.length > 0) {
        invalid.push({ ...user, errors });
      } else {
        valid.push(user);
      }
    });

    return { valid, invalid };
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsedData = parseCSV(text);
        const validation = validateUsers(parsedData);
        
        setCsvData(parsedData);
        setValidationResult(validation);
        setUploadStep('preview');
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Error parsing CSV file');
      }
    };
    reader.readAsText(file);
  };

  // Create users from valid data
  const createUsersFromCSV = async () => {
    if (!validationResult?.valid.length) return;

    setIsLoading(true);
    try {
      const token = authState.token;
      const userData = validationResult.valid.map(user => ({
        name: user.name,
        email: user.email
      }));

   await axios.post(
        "api/v1/tenant-user",
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Users created successfully:", response.data);
      setUploadStep('result');
    } catch (error) {
      console.error("Error creating users:", error);
      alert('Error creating users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Bulk User Upload</h2>
                <p className="text-green-100 text-xs sm:text-sm font-medium">
                  Upload CSV file to create multiple users
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 group"
            >
              <X className="h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
          {uploadStep === 'upload' && (
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">Instructions</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Upload a CSV file with "name" and "email" columns</li>
                  <li>• Each row should contain one user's information</li>
                  <li>• Ensure email addresses are unique and valid</li>
                  <li>• Names should contain only letters and spaces</li>
                </ul>
              </div>

              {/* Template Download */}
              <div className="text-center">
                <button
                  onClick={downloadTemplate}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Download CSV Template
                </button>
              </div>

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 hover:bg-green-50 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Upload CSV File</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop your file here, or click to browse
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Choose File
                </button>
              </div>
            </div>
          )}

          {uploadStep === 'preview' && validationResult && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{csvData.length}</div>
                  <div className="text-sm text-blue-800">Total Users</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{validationResult.valid.length}</div>
                  <div className="text-sm text-green-800">Valid Users</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{validationResult.invalid.length}</div>
                  <div className="text-sm text-red-800">Invalid Users</div>
                </div>
              </div>

              {/* Valid Users */}
              {validationResult.valid.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Valid Users ({validationResult.valid.length})
                  </h3>
                  <div className="bg-green-50 rounded-lg overflow-hidden">
                    <div className="max-h-40 overflow-y-auto">
                      {validationResult.valid.map((user, index) => (
                        <div key={index} className="px-4 py-2 border-b border-green-200 last:border-b-0">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-sm text-gray-600">{user.email}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Invalid Users */}
              {validationResult.invalid.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Invalid Users ({validationResult.invalid.length})
                  </h3>
                  <div className="bg-red-50 rounded-lg overflow-hidden">
                    <div className="max-h-40 overflow-y-auto">
                      {validationResult.invalid.map((user, index) => (
                        <div key={index} className="px-4 py-2 border-b border-red-200 last:border-b-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{user.name || 'No name'}</div>
                              <div className="text-sm text-gray-600">{user.email || 'No email'}</div>
                            </div>
                            <div className="text-xs text-red-600">
                              Row {user.row}: {user.errors?.join(', ')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {uploadStep === 'result' && (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Users Created Successfully!</h3>
              <p className="text-gray-600 mb-6">
                {validationResult?.valid.length} users have been created successfully.
              </p>
              <button
                onClick={() => {
                  onClose();
                  window.location.reload();
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Continue
              </button>
            </div>
          )}
        </div>

        {/* Action Footer */}
        {uploadStep === 'preview' && (
          <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-between">
            <button
              onClick={() => setUploadStep('upload')}
              className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Back to Upload
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createUsersFromCSV}
                disabled={!validationResult?.valid.length || isLoading}
                className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Create {validationResult?.valid.length || 0} Users
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddUserExcel;
<<<<<<< HEAD




// import React, { useState, useRef } from 'react';
// import { FileInput, X, User, Mail, Check, AlertTriangle, UserPlus } from "lucide-react";
// import { useAuth } from "../../../../hooks/useAuth";
// import axios from "../../../../helper/axios";
// import * as XLSX from 'xlsx';

// type AddExcelUserProps = {
//   onClose: () => void;
//   onUsersImported: () => void; // Callback to refresh user table after import
// };

// interface ExcelUser {
//   name: string;
//   email: string;
// }

// const AddExcelUser: React.FC<AddExcelUserProps> = ({ onClose, onUsersImported }) => {
//   const { authState } = useAuth();
//   const [file, setFile] = useState<File | null>(null);
//   const [validationMessage, setValidationMessage] = useState<string>("");
//   const [isValid, setIsValid] = useState<boolean | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [importResults, setImportResults] = useState<{
//     success: ExcelUser[];
//     errors: { row: number; error: string }[];
//   } | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (!selectedFile) return;

//     setFile(selectedFile);
//     validateFile(selectedFile);
//     setImportResults(null); // Reset previous import results
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const droppedFile = e.dataTransfer.files?.[0];
//     if (droppedFile) {
//       setFile(droppedFile);
//       validateFile(droppedFile);
//       setImportResults(null); // Reset previous import results
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const validateFile = (file: File) => {
//     if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
//       setValidationMessage("Please upload a valid Excel file (.xlsx or .xls)");
//       setIsValid(false);
//       return;
//     }

//     setValidationMessage("File format appears valid.");
//     setIsValid(true);
//   };

//   const processExcelFile = async (file: File): Promise<ExcelUser[]> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         try {
//           const data = new Uint8Array(e.target?.result as ArrayBuffer);
//           const workbook = XLSX.read(data, { type: 'array' });
//           const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
//           const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(firstSheet);

//           // Extract name and email from columns (assuming first column is name, second is email)
//           const users = jsonData.map((row, index) => {
//             const columns = Object.values(row);
//             return {
//               name: columns[0]?.toString() || '',
//               email: columns[1]?.toString() || ''
//             };
//           }).filter(user => user.name && user.email); // Filter out empty rows

//           resolve(users);
//         } catch (error) {
//           reject(error);
//         }
//       };

//       reader.onerror = (error) => {
//         reject(error);
//       };

//       reader.readAsArrayBuffer(file);
//     });
//   };

//   const validateUsers = (users: ExcelUser[]) => {
//     const errors: { row: number; error: string }[] = [];
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     const nameRegex = /^[a-zA-Z\s]+$/;

//     // Check for duplicates
//     const emailSet = new Set<string>();
//     const nameSet = new Set<string>();

//     users.forEach((user, index) => {
//       if (!user.name.trim()) {
//         errors.push({ row: index + 2, error: "Name is required" });
//       } else if (!nameRegex.test(user.name)) {
//         errors.push({ row: index + 2, error: "Name should contain only letters and spaces" });
//       } else if (nameSet.has(user.name.toLowerCase())) {
//         errors.push({ row: index + 2, error: "Duplicate name found" });
//       } else {
//         nameSet.add(user.name.toLowerCase());
//       }

//       if (!user.email.trim()) {
//         errors.push({ row: index + 2, error: "Email is required" });
//       } else if (!emailRegex.test(user.email)) {
//         errors.push({ row: index + 2, error: "Invalid email format" });
//       } else if (emailSet.has(user.email.toLowerCase())) {
//         errors.push({ row: index + 2, error: "Duplicate email found" });
//       } else {
//         emailSet.add(user.email.toLowerCase());
//       }
//     });

//     return errors;
//   };

//   const handleImport = async () => {
//     if (!file || !isValid) return;

//     setIsLoading(true);
//     try {
//       // Process the Excel file
//       const users = await processExcelFile(file);

//       // Validate the users
//       const validationErrors = validateUsers(users);

//       if (validationErrors.length > 0) {
//         setValidationMessage(`Found ${validationErrors.length} error(s) in the Excel file. Please fix them before importing.`);
//         setIsValid(false);
//         setImportResults({
//           success: [],
//           errors: validationErrors
//         });
//         return;
//       }

//       // If validation passes, send to API
//       const token = authState.token;
//       const response = await axios.post(
//         "api/v1/tenant-user",
//         users.map(user => ({
//           name: user.name,
//           email: user.email,
//         })),
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       // window.location.reload();
//       console.log("Users imported successfully:", response.data);
//       setImportResults({
//         success: users,
//         errors: []
//       });

//       // Refresh the user table
//       // onUsersImported();

//     } catch (error) {
//       console.error("Error importing users:", error);
//       console.log("Full error object:", JSON.stringify(error, null, 2));

//       setValidationMessage("An error occurred while importing users. Please try again.");
//       setIsValid(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg max-h-[95vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">

//         {/* Header */}
//         <div className=" bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-4 sm:px-6 py-4 sm:py-5 sticky top-0 z-10">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-white/20 rounded-lg">
//                 <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
//               </div>
//               <div>
//                 <h2 className="text-lg sm:text-xl font-bold text-white">Import Users from Excel</h2>
//                 <p className="text-blue-100 text-xs sm:text-sm font-medium">
//                   Upload an Excel file with user data
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               disabled={isLoading}
//               className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 group"
//             >
//               <X className="h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-200" />
//             </button>
//           </div>
//         </div>

//         {/* Form Content */}
//         <div className="p-4 sm:p-6 space-y-6">
//           <div
//             className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer"
//             onClick={() => fileInputRef.current?.click()}
//             onDrop={handleDrop}
//             onDragOver={handleDragOver}
//           >
//             <div className="flex flex-col items-center justify-center gap-3">
//               <FileInput className="h-10 w-10 text-gray-400" />
//               <div className="text-sm text-gray-600">
//                 {file ? (
//                   <span className="font-medium text-blue-600">{file.name}</span>
//                 ) : (
//                   <>
//                     <span className="font-medium">Drag & drop your Excel file here, or </span>
//                     <span className="relative cursor-pointer text-blue-600 hover:text-blue-800">
//                       browse
//                     </span>
//                   </>
//                 )}
//               </div>
//               <p className="text-xs text-gray-500">
//                 Excel files only (.xlsx, .xls)
//               </p>
//             </div>
//             <input
//               ref={fileInputRef}
//               type="file"
//               className="hidden"
//               accept=".xlsx,.xls"
//               onChange={handleFileChange}
//             />
//           </div>

//           {/* Validation message */}
//           {validationMessage && (
//             <div className={`p-3 rounded-lg flex items-start gap-3 ${isValid ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
//               }`}>
//               {isValid ? (
//                 <Check className="h-5 w-5 mt-0.5 text-green-500" />
//               ) : (
//                 <AlertTriangle className="h-5 w-5 mt-0.5 text-red-500" />
//               )}
//               <div className="text-sm">
//                 <p className="font-medium">
//                   {isValid ? "Validation passed" : "Validation error"}
//                 </p>
//                 <p>{validationMessage}</p>
//               </div>
//             </div>
//           )}

//           {/* Import Results */}
//           {importResults && (
//             <div className="space-y-4">
//               {importResults.success.length > 0 && (
//                 <div className="bg-green-50 p-3 rounded-lg text-green-800">
//                   <div className="flex items-start gap-3">
//                     <Check className="h-5 w-5 mt-0.5 text-green-500 flex-shrink-0" />
//                     <div>
//                       <p className="font-medium">Successfully imported {importResults.success.length} users</p>
//                       <div className="mt-2 max-h-40 overflow-y-auto">
//                         {importResults.success.map((user, index) => (
//                           <div key={index} className="text-xs py-1 border-b border-green-100">
//                             <span className="font-medium">{user.name}</span> - {user.email}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {importResults.errors.length > 0 && (
//                 <div className="bg-red-50 p-3 rounded-lg text-red-800">
//                   <div className="flex items-start gap-3">
//                     <AlertTriangle className="h-5 w-5 mt-0.5 text-red-500 flex-shrink-0" />
//                     <div>
//                       <p className="font-medium">{importResults.errors.length} errors found</p>
//                       <div className="mt-2 max-h-40 overflow-y-auto text-xs">
//                         <table className="w-full">
//                           <thead>
//                             <tr className="border-b border-red-200">
//                               <th className="text-left py-1 px-2">Row</th>
//                               <th className="text-left py-1 px-2">Error</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {importResults.errors.map((error, index) => (
//                               <tr key={index} className="border-b border-red-100">
//                                 <td className="py-1 px-2">{error.row}</td>
//                                 <td className="py-1 px-2">{error.error}</td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Requirements */}
//           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">File Requirements:</h3>
//             <ul className="text-xs text-gray-600 space-y-1.5">
//               <li className="flex items-start gap-2">
//                 <Check className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
//                 <span>First column: Full name (letters and spaces only)</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <Check className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
//                 <span>Second column: Email address (valid format)</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <Check className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
//                 <span>No duplicate names or emails</span>
//               </li>
//               {/* <li className="flex items-start gap-2">
//                 <Check className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
//                 <span>No empty rows</span>
//               </li> */}
//               <li className="flex items-start gap-2">
//                 <Check className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
//                 <span>First row will be treated as header and skipped</span>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Action Footer */}
//         <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end sticky bottom-0">
//           <button
//             className="w-full cursor-pointer sm:w-auto px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
//             onClick={() => {
//               if (importResults && importResults.success.length > 0) {
//                 window.location.reload(); // Reload if successful import
//               } else {
//                 onClose(); // Otherwise just close the modal
//               }
//             }}
//             disabled={isLoading}
//           >
//             {importResults ? 'Close' : 'Cancel'}
//           </button>

//           {!importResults && (
//             <button
//               className="w-full cursor-pointer sm:w-auto px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 shadow-lg"
//               onClick={handleImport}
//               disabled={!file || !isValid || isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                   Importing...
//                 </>
//               ) : (
//                 <>
//                   <FileInput className="h-4 w-4" />
//                   Import Users
//                 </>
//               )}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddExcelUser;
=======
>>>>>>> 4250042e017b110896f28dee5744c68b9adf2920
