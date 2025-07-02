import React, { useState, useEffect } from "react";
import {  Edit2, Trash2 } from "lucide-react";
import axios from "../../../helper/axios";
import { toast } from "react-toastify";

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

interface Asset {
  id: number;
  asset_group_code: string;
  description: string;
  low_value_limit:string;
  asset_group_name: string;
  isEnabled: boolean;
  status:string;
  organization_name: string;
}

const AssetMaster: React.FC = () => {
  const [assetGroups] = useState<string[]>([
    ...defaultAssetGroups,
  ]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [newGroup, setNewGroup] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    assetGroup: assetGroups[0],
    description: "",
    Asset_Value:""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAsset) {
      // Update existing asset
      setAssets((prev) =>
        prev.map((asset) =>
          asset.id === editingAsset.id ? { ...asset, ...formData } : asset
        )
      );
      setEditingAsset(null);
    } else {
      // Add new asset
      const newAsset: Asset = {
        id: Date.now(),
        ...formData,
        isEnabled: true,
      };
      setAssets((prev) => [...prev, newAsset]);
    }

    // Reset form
    setFormData({
      code: "",
      assetGroup: assetGroups[0],
      description: "",
      Asset_Value:""
    });
    setShowForm(false);
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      code: asset.code,
      assetGroup: asset.assetGroup,
      description: asset.description,
      Asset_Value:asset.Asset_Value
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== id));
  };

  const toggleAssetStatus = (id: number) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === id ? { ...asset, isEnabled: !asset.isEnabled } : asset
      )
    );
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAsset(null);
    setFormData({
      code: "",
      assetGroup: assetGroups[0],
      description: "",
      Asset_Value:""
    });
  };


   const fetchAssets = async () => {
        try {
          const response = await axios.get(`api/v1/lease-asset-groups`, {
          });
          setAssets(response?.data?.data?.lease_asset_groups);
          console.log(
            "Assets data fetched successfully:",
            response.data
          );
        } catch (error: any) {
          console.error("Failed to fetch Assets:", error);
          toast.error("Failed to load Assets");
        }
      };
    
      useEffect(() => {
        fetchAssets();
      }, []);

  return (
    <div className="bg-gray-50  mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        {/* Left side: Search Bar */}
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search Asset..."
            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Right side: Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Asset
          </button>

          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
            Export Excel
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold mb-4">
                {editingAsset ? "Edit Asset" : "Create New Asset"}
              </h3>

              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form className="space-y-4">
              {/* Asset Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="Enter Asset code"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  placeholder="Enter Asset Description"
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Value
                </label>
                <input
                  type="text"
                  name="Asset_Value"
                  value={formData.Asset_Value}
                  placeholder="Asset Value"
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              {/* Asset Group */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Group
                </label>
                <select
                  name="assetGroup"
                  value={formData.assetGroup}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {assetGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div> */}

              {/* Add New Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add New Group (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value)}
                    className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter new group name"
                  />
                  {/* <button
                    type="button"
                    onClick={handleAddGroup}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                  >
                    Add
                  </button> */}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingAsset ? "Update Asset" : "Save Asset"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assets Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
     
        <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Asset Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Organization Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Asset Value
                  </th>

              
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Asset Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  {assets.length === 0 ? (
                   <tr>
                   <td colSpan={10} className="px-6 py-12 text-center">
                     <div className="flex flex-col items-center">
                       <svg
                         className="w-12 h-12 text-gray-300 mb-4"
                         fill="none"
                         stroke="currentColor"
                         viewBox="0 0 24 24"
                       >
                         <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={1}
                           d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                         />
                       </svg>
                       <h3 className="text-lg font-medium text-gray-900 mb-2">
                         No Asset found
                       </h3>
                      
                       <button
                          onClick={() => setShowForm(true)}
                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                       >
                         Create Asset
                       </button>
                     </div>
                   </td>
                 </tr>
                  ) : (assets.map((asset) => (
                  <tr
                    key={asset.id}
                    className={asset.isEnabled ? "" : "opacity-60"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {asset.asset_group_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.organization_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.low_value_limit}
                    </td>
                  
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.asset_group_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/* <div className="flex items-center">
                        <button
                          onClick={() => toggleAssetStatus(asset.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            asset.isEnabled ? "bg-green-600" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              asset.isEnabled
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span className="ml-2 text-sm">
                          {asset.isEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </div> */}
                      {asset.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(asset)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
            )}
              </tbody>
            </table>
          </div>
   
      </div>
    </div>
  );
};

export default AssetMaster;