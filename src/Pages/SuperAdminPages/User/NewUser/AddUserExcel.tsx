import { UserPlus, X, Upload, FileText, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
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

interface DuplicateEmailError {
  email: string;
  name: string;
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
  const [uploadStep, setUploadStep] = useState<'upload' | 'preview' | 'result' | 'duplicate-error'>('upload');
  const [duplicateErrors, setDuplicateErrors] = useState<DuplicateEmailError[]>([]);
  const [createdUsersCount, setCreatedUsersCount] = useState(0);

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

  // Parse duplicate email error from response
  const parseDuplicateError = (error: any): DuplicateEmailError[] => {
    const duplicates: DuplicateEmailError[] = [];
    
    if (error.response?.status === 409) {
      const errorMessage = error.response.data?.detail || '';
      
      // Extract email from error message like "Tenant user with email 'rohit@gmail.com' already exists."
      const emailMatch = errorMessage.match(/email '([^']+)'/);
      if (emailMatch) {
        const duplicateEmail = emailMatch[1];
        // Find the user data for this email
        const userData = validationResult?.valid.find(user => user.email === duplicateEmail);
        duplicates.push({
          email: duplicateEmail,
          name: userData?.name || 'Unknown'
        });
      }
    }
    
    return duplicates;
  };

  // Create users from valid data
  const createUsersFromCSV = async (skipDuplicates = false) => {
    if (!validationResult?.valid.length) return;

    setIsLoading(true);
    try {
      const token = authState.token;
      let usersToCreate = validationResult.valid;
      
      // If skipping duplicates, remove users with emails that already exist
      if (skipDuplicates && duplicateErrors.length > 0) {
        const duplicateEmails = duplicateErrors.map(d => d.email);
        usersToCreate = validationResult.valid.filter(user => !duplicateEmails.includes(user.email));
      }

      const userData = usersToCreate.map(user => ({
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

      setCreatedUsersCount(usersToCreate.length);
      setUploadStep('result');
    } catch (error: any) {
      console.error("Error creating users:", error);
      
      // Handle duplicate email error (409)
      if (error.response?.status === 409) {
        const duplicates = parseDuplicateError(error);
        setDuplicateErrors(duplicates);
        setUploadStep('duplicate-error');
      } else {
        alert('Error creating users. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle skip duplicates and create remaining users
  const handleSkipDuplicates = () => {
    createUsersFromCSV(true);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        
        {/* Header */}
        <div className={`relative px-4 sm:px-6 py-4 sm:py-5 ${
          uploadStep === 'duplicate-error' 
            ? 'bg-gradient-to-r from-orange-600 via-orange-700 to-red-700' 
            : 'bg-gradient-to-r from-green-600 via-green-700 to-emerald-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                {uploadStep === 'duplicate-error' ? (
                  <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                ) : (
                  <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {uploadStep === 'duplicate-error' ? 'Duplicate Email Detected' : 'Bulk User Upload'}
                </h2>
                <p className="text-green-100 text-xs sm:text-sm font-medium">
                  {uploadStep === 'duplicate-error' 
                    ? 'Some users already exist in the system' 
                    : 'Upload CSV file to create multiple users'
                  }
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

          {uploadStep === 'duplicate-error' && (
            <div className="space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-orange-800 mb-2">Duplicate Email Found</h3>
                <p className="text-orange-700 mb-4">
                  The following users already exist in your system:
                </p>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  {duplicateErrors.map((duplicate, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-orange-200 last:border-b-0">
                      <span className="font-medium text-gray-800">{duplicate.name}</span>
                      <span className="text-sm text-orange-600">{duplicate.email}</span>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-orange-600 mb-4">
                  Would you like to skip these duplicate users and create the remaining ones?
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setUploadStep('preview')}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleSkipDuplicates}
                    disabled={isLoading}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Creating...
                      </>
                    ) : (
                      'Skip Duplicates & Create Others'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {uploadStep === 'result' && (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Users Created Successfully!</h3>
              <p className="text-gray-600 mb-6">
                {createdUsersCount} users have been created successfully.
                {duplicateErrors.length > 0 && (
                  <span className="block text-sm text-orange-600 mt-2">
                    ({duplicateErrors.length} duplicate users were skipped)
                  </span>
                )}
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
                onClick={() => createUsersFromCSV(false)}
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
