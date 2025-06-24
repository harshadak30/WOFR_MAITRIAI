import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import BulkUploadForm from "./BulkUploadForm";

const BulkUpload: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <Link
          to="/dashboard/Lease"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Leases
        </Link>
      </div>

      <BulkUploadForm />
    </div>
  );
};

export default BulkUpload;
