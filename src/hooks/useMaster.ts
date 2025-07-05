import { useState, useEffect } from "react";
import axios from "../helper/axios";

import { useAuth } from "./useAuth";

import { toast } from "react-toastify";

interface GlMasterData {
  id: number;
  entity_id: number;
  entry_name: string;
  event_phase: string;
  entity_name: string;
  description_narration: string;
  gl_code: string;
  gl_description: string;
  department_id: number;
  department_name: string;
  created_at: string;
  status: string;
}
interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
interface GlMasterFormData {
  Entry_Name: string;
  Event: string;
  Entity_ID: number;
  Description?: string;
  GL_Code?: string;
  GL_Description: string;
  Dept_ID?: string;
}
interface LessorData {
  id: number;
  lessor_id: number;
  lessor_name: string;
  vendor_code: string;
  vat_applicable: string;
  email: string;
  tax_deduction_applicable: string;
  vendor_bank_name: string;
  related_party_relationship: string;
  vat_registration_number: string;
  tax_identification_number: string;
  vendor_bank_account_number: string;
  created_at: string;
  organization_name: string;
}
const defaultAssetGroups = [
  "Aircrafts or Helicopters",
  "Building",
  "Computers and Data Processing Units",
  "Electrical Installations and Equipment",
  "Furniture and Fittings",
  "Laboratory Equipment",
  "Land",
  "Plant and Machinery",
  "Office Equipment",
  "Roads",
  "Ships",
  "Motor Vehicles",
];
interface FormDataLessor {
  Lessor_Name: string;
  Vendor_Code: string;
  VAT_application: string;
  Email: string;
  Tax_deduction_Application: string;
  Vendor_bank_name: string;
  relatedPartyRelationship: string;
  Vendor_registration_number: string;
  Tax_Identification_number: string;
  Vendor_Bank_Account_Number: string;
}
interface Asset {
  id: number;
  asset_group_code: string;
  description: string;
  low_value_limit: string;
  asset_group_name: string;
  isEnabled: boolean;
  status: string;
  organization_name: string;
}

interface EntityFormData {
  name: string;
  Industry_Sector: string;
  incorporation_date?: string;
  Ownership_share?: string;
  Tax_ID: string;
  Parent_Name?: string;
  Relationship_Type: string;
}

interface Department {
  department_id: Key | null | undefined;
  id: number;
  department_code: string;
  department_name: string;
  isEnabled: boolean;
  status: string;
}

interface EntityData {
  functional_currency: ReactNode;
  financial_start_date: ReactNode;
  parentOrganization: ReactNode;
  relationship_type: ReactNode;
  ownership_share_percent: ReactNode;
  id: number;
  entity_id: number;
  entry_name: string;
  event_phase: string;
  entity_name: string;
  Event: string;
  description_narration: string;
  gl_code: string;
  gl_description: string;
  department_id: string;
  department_name: string;
  created_at: string;
}

const useMaster = () => {
  //*********** Lessor Master *****************
  const [LessorData, setLessorData] = useState<LessorData[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState("");
  const { authState } = useAuth();
  const relationshipTypes = [
    { id: 1, name: "Subsidiary" },
    { id: 2, name: "Branch" },
    { id: 3, name: "Division" },
    { id: 4, name: "Joint Venture" },
    { id: 5, name: "Associate" },
  ];

  const vatOptions = [
    { value: "applicable", label: "Applicable" },
    { value: "not_applicable", label: "Not Applicable" },
    { value: "exempt", label: "Exempt" },
  ];

  const taxDeductionOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fetchOrganizationId = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        "/api/v1/tenant?page=1&limit=10&sort_by=created_at&sort_order=asc",
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setOrganizationId(response.data.data.tenants[0].tenant_id);
    } catch (error) {
      console.error("Failed to fetch organization ID:", error);
      toast.error("Failed to load organization information");
    }
  };

  const fetchLessors = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`api/v1/lease-lessors`);
      setLessorData(response?.data?.data?.lease_lessors);
    } catch (error: any) {
      console.error("Failed to fetch lessors:", error);
      toast.error("Failed to load lessors");
    } finally {
      setIsLoading(false);
    }
  };


  //***********  Asset  *******************
const createLessor = async (data: FormDataLessor) => {
  setIsSubmitting(true);
  try {
    const requestData = {
      organization_id: organizationId,
      vendor_code: data.Vendor_Code,
      lessor_name: data.Lessor_Name,
      vat_applicable: data.VAT_application,
      tax_deduction_applicable: data.Tax_deduction_Application,
      email: data.Email,
      related_party_relationship:
        relationshipTypes.find(
          (type) => type.id.toString() === data.relatedPartyRelationship
        )?.name || "Not specified",
      vendor_bank_name: data.Vendor_bank_name,
      vat_registration_number: data.Vendor_registration_number,
      tax_identification_number: data.Tax_Identification_number,
      vendor_bank_account_number: data.Vendor_Bank_Account_Number,
      status: "active",
    };

    const response = await axios.post("/api/v1/lease-lessor", requestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authState.token}`,
      },
    });

    if (response.status >= 200 && response.status < 300) {
      await fetchLessors(); 
      toast.success("Lessor created successfully");
      return true;
    }
    return false; 
  } catch (error: any) {
    console.error("Error creating lessor:", error);
    toast.error(
      error.response?.data?.detail ||
        error.message ||
        "Failed to create lessor"
    );
    return false; // Return false on error
  } finally {
    setIsSubmitting(false);
  }
};
  const [assetGroups] = useState<string[]>([...defaultAssetGroups]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [formData, setFormData] = useState({
    code: "",
    assetGroup: assetGroups[0],
    description: "",
    Asset_Value: "",
  });
  const fetchAssets = async () => {
    try {
      const response = await axios.get(`api/v1/lease-asset-groups`);
      setAssets(response?.data?.data?.lease_asset_groups);
    } catch (error: any) {
      console.error("Failed to fetch Assets:", error);
      toast.error("Failed to load Assets");
    }
  };

 


  const createAsset = async (assetData: {
    asset_group_code: string;
    asset_group_name: string;
    description: string;
    low_value_limit: string;
    organization_id: string;
  }) => {
    setIsSubmitting(true);
    try {
      const payload = {
        organization_id: assetData.organization_id,
        asset_group_name: assetData.asset_group_name,
        description: assetData.description,
        low_value_limit: assetData.low_value_limit,
        status: "active"
      };

      const response = await axios.post("/api/v1/lease-asset-group", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success("Asset created successfully");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error saving asset:", error);
      toast.error(error.response?.data?.message || "Failed to save asset");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };


  //***********  Entity master  *******************
  const [entities, setEntities] = useState<EntityData[]>([]);

  const organizations = [
    { tenant_id: "ORG001", name: "Main Corp" },
    { tenant_id: "ORG002", name: "Tech Solutions Ltd" },
    { tenant_id: "ORG003", name: "Global Services Inc" },
  ];

  const fetchEntityMaster = async () => {
    try {
      const response = await axios.get(`api/v1/entities`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setEntities(response.data);
      console.log("Entities data fetched successfully:", response.data);
    } catch (error: any) {
      console.error("Failed to fetch Entities:", error);
      toast.error("Failed to load Entities");
    }
  };

  const EntitySubmit = async (data: EntityFormData) => {
  setIsSubmitting(true);

  try {
    const requestData = {
      organization_id: organizationId,
      entity_name: data.name,
      functional_currency: data.Industry_Sector,
      financial_start_date: data.incorporation_date
        ? new Date(data.incorporation_date).toISOString()
        : new Date().toISOString(),
      ownership_share_percent: data.Ownership_share || "0",
      relationship_type:
        relationshipTypes.find(
          (type) => type.id.toString() === data.Relationship_Type
        )?.name || "Not specified",
      related_to:
        data.Parent_Name === "own"
          ? "Own Organization"
          : organizations.find((org) => org.tenant_id === data.Parent_Name)
              ?.name || "Not specified",
      department_name: data.Tax_ID || "Not specified",
      status: "active",
    };

    const response = await axios.post("/api/v1/entities", requestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authState.token}`,
      },
    });
    
    if (response.status >= 200 && response.status < 300) {
      fetchEntityMaster();
      toast.success("Entity created successfully");
      return true; 
    }
    return false; 
  } catch (error: any) {
    console.error("Error creating entity:", error.response?.data || error.message);
    toast.error(error.response?.data?.detail || "Failed to create entity");
    return false; 
  } finally {
    setIsSubmitting(false);
  }
};
// ***8** department master
  const [department, setDepartment] = useState<Department[]>([]);
  const [isSubmittingDept, setIsSubmittingDept] = useState(false);

  const fetchDepartment = async () => {
    try {
      const response = await axios.get(`/api/v1/departments`);
      setDepartment(response?.data?.data?.departments || []);
    } catch (error) {
      console.error("Error fetching department data:", error);
      toast.error("Failed to fetch department data");
    }
  };
const createDepartment = async (departmentName: string) => {
    setIsSubmitting(true);
    try {
     

      const departmentData = {
        department_name: departmentName,
        status: 'active'
      };

      const response = await axios.post(
        '/api/v1/department',
        departmentData,
        {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authState.token}`
          }
        }
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success('Department created successfully');
        fetchDepartment(); // Refresh the list
        return true; // Return success status
      }
      throw new Error(response.data?.message || 'Failed to create department');
    } catch (error: any) {
      console.error('Error creating department:', error);
      toast.error(error.message || 'Failed to create department');
      return false; // Return failure status
    } finally {
      setIsSubmitting(false);
    }
  };



    //********** GLMaster  **********/

      const [glData, setGlData] = useState<EntityData[]>([]);

    const [glPagination, setGlPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1,
  });
  
const fetchGlData = async (page: number = glPagination.currentPage, limit: number = glPagination.itemsPerPage) => {
  try {
    const response = await axios.get(`/api/v1/lease-gl-masters`, {
      params: {
        page,
        limit,
        sort_by: 'created_at',
        sort_order: 'asc'
      }
    });

    const data = response?.data?.data;
    setGlData(data?.lease_gl_masters || []);
    
    // Update pagination state
    setGlPagination(prev => ({
      ...prev,
      currentPage: page,
      itemsPerPage: limit,
      totalItems: data?.total_count || 0,
      totalPages: Math.ceil((data?.total_count || 0) / limit)
    }));

  } catch (error) {
    console.error("Error fetching GL data:", error);
    toast.error("Failed to fetch GL data");
  }
};

  const handleMaster = async (data: GlMasterFormData, onSuccess?: () => void) => {
  try {
    const payload = {
      entity_id: Number(data.Entity_ID),
      department_id: Number(data.Dept_ID),
      event_phase: data.Event,
      entry_name: data.Entry_Name,
      description_narration: data.Description || "",
      gl_code: data.GL_Code || "",
      gl_description: data.GL_Description,
      status: "active",
    };

    const response = await axios.post("/api/v1/lease-gl-master", payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authState.token}`,
      },
    });
    console.log(response);

    if (response.status >= 200 && response.status < 300) {
      await fetchGlData(); 
      toast.success("Data added successfully");
      if (onSuccess) onSuccess(); // Call the success callback
      return true;
    }
    return false;
  } catch (error: any) {
    console.error("Error creating GL Master:", error);
    toast.error(
      error.response?.data?.message ||
      "Failed to create GL Master. Please check console for details."
    );
    return false;
  }
};

  useEffect(() => {
    fetchOrganizationId();
    fetchLessors();
    fetchAssets();
    fetchEntityMaster();
    fetchDepartment();
    fetchGlData();
    // glData();
  }, []);

  return {
    entities,
    isLoading,
    isSubmitting,
    relationshipTypes,
    vatOptions,
    taxDeductionOptions,
    emailPattern,
    fetchLessors,
    createLessor,
    assets,
    createAsset,
    fetchEntityMaster,
    EntitySubmit,
    department,
    glData,
    LessorData,
    fetchAssets,
    createDepartment,
    isSubmittingDept,
    fetchDepartment,
    handleMaster,
    glPagination,
    setGlPagination,
    fetchGlData
    // EntityData
  };
};

export default useMaster;
