import { useLocation } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Building2,
  Mail,
  Calendar,
  Shield,
  Users,
  Activity,
  CheckCircle,
  XCircle,
  Layers,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useRef, useState } from "react";
import React from "react";

interface SubAction {
  sub_action_id: number;
  sub_action_name: string;
}

interface Role {
  role_name: string;
}

interface Action {
  action_name: string;
}

interface Module {
  module_name: string;
}

interface ModuleActionPair {
  module: Module;
  action: Action;
}

interface ScreenData {
  module_action_pair: ModuleActionPair;
  role: Role;
  screen_id: number;
}

interface AssignmentData {
  assignment_id?: number;
  tenant_user_id: string;
  screen_data: ScreenData;
  sub_action: SubAction | null;
  created_at?: string;
  updated_at: string;
}

interface ModuleSummary {
  moduleId: number;
  moduleName: string;
  totalRoles: number;
  rolesList: string[];
  totalActions: number;
  actionsList: string[];
  totalSubActions: number;
  subActionsList: string[];
  totalScreens: number;
  status: string;
}

const InfoCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  </div>
);

const HoverTooltip = ({
  children,
  items,
  maxVisible = 2,
}: {
  children: React.ReactNode;
  items: string[];
  maxVisible?: number;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  if (items.length <= maxVisible) {
    return <>{children}</>;
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipWidth = 280;
    const tooltipHeight = Math.min(items.length * 25 + 60, 300);

    let x = rect.left + rect.width / 2 - tooltipWidth / 2;
    let y = rect.bottom + 8;

    if (x < 8) x = 8;
    if (x + tooltipWidth > window.innerWidth - 8) {
      x = window.innerWidth - tooltipWidth - 8;
    }

    if (y + tooltipHeight > window.innerHeight - 8) {
      y = rect.top - tooltipHeight - 8;
    }

    setTooltipPosition({ x, y });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <>
      <div className="relative">
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="cursor-help"
        >
          {children}
        </div>
      </div>

      {showTooltip && (
        <div
          ref={tooltipRef}
          className="fixed z-[9999] p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl border border-slate-600"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            width: "280px",
            maxHeight: "300px",
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="font-medium mb-2 text-slate-200">
            All items ({items.length}):
          </div>
          <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700">
            {items.map((item, index) => (
              <div key={index} className="flex items-start gap-2 py-1">
                <span className="w-1 h-1 bg-white rounded-full mt-1.5 flex-shrink-0"></span>
                <span className="text-slate-100 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const UserProfile = () => {
  const location = useLocation();
  const { user, assignmentData, assignmentDetails } = location.state || {};

  const [loading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="text-center p-6 bg-red-50 rounded-xl shadow-lg border border-red-200 max-w-md">
          <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-700 font-semibold">User data not found</p>
          <p className="text-red-600 text-sm mt-2">
            Please navigate from the User Management page.
          </p>
        </div>
      </div>
    );
  }

  const createdDate = new Date(
    user.created_at || Date.now()
  ).toLocaleDateString();

  // Process assignment data to create module summary
  const moduleSummaryData = React.useMemo(() => {
    if (!assignmentData || !Array.isArray(assignmentData)) {
      return [];
    }

    // Group assignments by module
    const moduleGroups = assignmentData.reduce((acc: { [key: string]: AssignmentData[] }, assignment: unknown) => {
      // Add type guard right after line 130:
      if (!assignment || typeof assignment !== 'object' || !('screen_data' in assignment)) {
        return acc;
      }
      const typedAssignment = assignment as AssignmentData;
      
      // Line 131 - Update to use typedAssignment:
      const moduleName = typedAssignment.screen_data.module_action_pair.module.module_name;
      if (!acc[moduleName]) {
        acc[moduleName] = [];
      }
      // Line 135 - Update to use typedAssignment:
      acc[moduleName].push(typedAssignment);
      return acc;
    }, {});

    // Create summary for each module
    return Object.entries(moduleGroups).map(
      ([moduleName, assignments], index): ModuleSummary => {
        const uniqueRoles = [
          ...new Set(assignments.map((a) => a.screen_data.role.role_name)),
        ];
        const uniqueActions = [
          ...new Set(
            assignments.map(
              (a) => a.screen_data.module_action_pair.action.action_name
            )
          ),
        ];
        const allSubActions = assignments
          .filter((a) => a.sub_action)
          .map((a) => a.sub_action!.sub_action_name);
        const uniqueSubActions = [...new Set(allSubActions)];
        const uniqueScreens = [
          ...new Set(assignments.map((a) => a.screen_data.screen_id)),
        ];

        return {
          moduleId: index + 1, // Using index as ID since we don't have module ID
          moduleName,
          totalRoles: uniqueRoles.length,
          rolesList: uniqueRoles,
          totalActions: uniqueActions.length,
          actionsList: uniqueActions,
          totalSubActions: uniqueSubActions.length,
          subActionsList: uniqueSubActions,
          totalScreens: uniqueScreens.length,
          status: "active", // Assuming all are active since they exist
        };
      }
    );
  }, [assignmentData]);

  const overallStats = React.useMemo(() => {
    if (!assignmentData || !Array.isArray(assignmentData)) {
      return {
        totalModules: 0,
        totalUniqueRoles: 0,
        totalUniqueActions: 0,
        totalUniqueSubActions: 0,
        totalScreens: 0,
      };
    }

    const totalModules = moduleSummaryData.length;
    const totalUniqueRoles = [
      ...new Set(moduleSummaryData.flatMap((m) => m.rolesList)),
    ].length;
    const totalUniqueActions = [
      ...new Set(moduleSummaryData.flatMap((m) => m.actionsList)),
    ].length;
    const totalUniqueSubActions = [
      ...new Set(moduleSummaryData.flatMap((m) => m.subActionsList)),
    ].length;
    const totalScreens = [
      ...new Set(assignmentData.map((a) => a.screen_data.screen_id)),
    ].length;

    return {
      totalModules,
      totalUniqueRoles,
      totalUniqueActions,
      totalUniqueSubActions,
      totalScreens,
    };
  }, [assignmentData, moduleSummaryData]);

  const toggleRowExpansion = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-4 bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </button>

          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                <p className="text-white/80">
                  User ID: {user.tenant_user_id || user.user_id}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                    {user.OrgName}
                  </span>
                  {assignmentDetails && (
                    <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                      {assignmentDetails.totalAssignments} Assignments
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Profile
              </h2>
              <div className="space-y-3">
                <InfoCard
                  icon={Building2}
                  label="Organization"
                  value={user.OrgName}
                />
                <InfoCard
                  icon={User}
                  label="User ID"
                  value={user.tenant_user_id || user.user_id}
                />
                <InfoCard icon={Mail} label="Email" value={user.email} />
                <InfoCard icon={Calendar} label="Joined" value={createdDate} />
              </div>
            </div>
          </div>

          <div className="xl:col-span-4">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-bold text-slate-800">
                      Module Permissions Summary
                    </h2>
                  </div>
                  <div className="flex gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Layers className="w-4 h-4" />
                      {overallStats.totalModules} Modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {overallStats.totalUniqueRoles} Roles
                    </span>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
                </div>
              ) : moduleSummaryData.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">
                    No modules assigned
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden">
                  {/* Desktop Table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm min-w-[150px]">
                            Module
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm min-w-[120px]">
                            Roles ({overallStats.totalUniqueRoles})
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm min-w-[150px]">
                            Actions ({overallStats.totalUniqueActions})
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm min-w-[150px]">
                            Sub-Actions ({overallStats.totalUniqueSubActions})
                          </th>
                          {/* <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm min-w-[100px]">
                            Screens ({overallStats.totalScreens})
                          </th> */}
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm min-w-[80px]">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {moduleSummaryData.map((module) => (
                          <tr
                            key={module.moduleId}
                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-slate-800 text-sm block">
                                    {module.moduleName}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    ID: {module.moduleId}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Users className="w-4 h-4 text-green-600 flex-shrink-0" />
                                  <span className="font-medium text-slate-700 text-sm">
                                    {module.totalRoles} Role
                                    {module.totalRoles !== 1 ? "s" : ""}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {module.rolesList
                                    .slice(0, 2)
                                    .map((role, i) => (
                                      <span
                                        key={i}
                                        className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium"
                                      >
                                        {role}
                                      </span>
                                    ))}
                                  {module.rolesList.length > 2 && (
                                    <HoverTooltip
                                      items={module.rolesList}
                                      maxVisible={2}
                                    >
                                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs cursor-help">
                                        +{module.rolesList.length - 2} more
                                      </span>
                                    </HoverTooltip>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Activity className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                  <span className="font-medium text-slate-700 text-sm">
                                    {module.totalActions} Action
                                    {module.totalActions !== 1 ? "s" : ""}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {module.actionsList
                                    .slice(0, 2)
                                    .map((action, i) => (
                                      <span
                                        key={i}
                                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                                      >
                                        {action}
                                      </span>
                                    ))}
                                  {module.actionsList.length > 2 && (
                                    <HoverTooltip
                                      items={module.actionsList}
                                      maxVisible={2}
                                    >
                                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs cursor-help">
                                        +{module.actionsList.length - 2} more
                                      </span>
                                    </HoverTooltip>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                  <span className="font-medium text-slate-700 text-sm">
                                    {module.totalSubActions} Sub-Action
                                    {module.totalSubActions !== 1 ? "s" : ""}
                                  </span>
                                </div>
                                {module.totalSubActions > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {module.subActionsList
                                      .slice(0, 2)
                                      .map((subAction, i) => (
                                        <span
                                          key={i}
                                          className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
                                        >
                                          {subAction}
                                        </span>
                                      ))}
                                    {module.subActionsList.length > 2 && (
                                      <HoverTooltip
                                        items={module.subActionsList}
                                        maxVisible={2}
                                      >
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs cursor-help">
                                          +{module.subActionsList.length - 2}{" "}
                                          more
                                        </span>
                                      </HoverTooltip>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-400">
                                    No sub-actions
                                  </span>
                                )}
                              </div>
                            </td>
                           
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                {module.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="lg:hidden">
                    {moduleSummaryData.map((module, index) => (
                      <div
                        key={module.moduleId}
                        className="border-b border-slate-100 last:border-b-0"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Layers className="w-4 h-4 text-blue-600" />
                              <div>
                                <span className="font-semibold text-slate-800 text-sm">
                                  {module.moduleName}
                                </span>
                                <span className="text-xs text-slate-500 block">
                                  ID: {module.moduleId}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                {module.status}
                              </span>
                              <button
                                onClick={() => toggleRowExpansion(index)}
                                className="p-1 hover:bg-slate-100 rounded transition-colors"
                              >
                                {expandedRows.has(index) ? (
                                  <ChevronDown className="w-4 h-4 text-slate-500" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-slate-500" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-center mb-2">
                            <div className="bg-green-50 p-2 rounded">
                              <div className="font-semibold text-green-800">
                                {module.totalRoles}
                              </div>
                              <div className="text-xs text-green-600">
                                Roles
                              </div>
                            </div>
                            <div className="bg-blue-50 p-2 rounded">
                              <div className="font-semibold text-blue-800">
                                {module.totalActions}
                              </div>
                              <div className="text-xs text-blue-600">
                                Actions
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="bg-purple-50 p-2 rounded">
                              <div className="font-semibold text-purple-800">
                                {module.totalSubActions}
                              </div>
                              <div className="text-xs text-purple-600">
                                Sub-Actions
                              </div>
                            </div>
                            <div className="bg-indigo-50 p-2 rounded">
                              <div className="font-semibold text-indigo-800">
                                {module.totalScreens}
                              </div>
                              <div className="text-xs text-indigo-600">
                                Screens
                              </div>
                            </div>
                          </div>

                          {expandedRows.has(index) && (
                            <div className="mt-3 space-y-3 pt-3 border-t border-slate-100">
                              <div>
                                <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  Roles ({module.totalRoles})
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {module.rolesList.map((role, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                                    >
                                      {role}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
                                  <Activity className="w-3 h-3" />
                                  Actions ({module.totalActions})
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {module.actionsList.map((action, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                                    >
                                      {action}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {module.totalSubActions > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Sub-Actions ({module.totalSubActions})
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {module.subActionsList.map(
                                      (subAction, i) => (
                                        <span
                                          key={i}
                                          className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
                                        >
                                          {subAction}
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
