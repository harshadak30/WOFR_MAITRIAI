import React, { ReactNode } from "react";

interface TabsProps {
  children: ReactNode;
  activeTab: number;
  onChange: (index: number) => void;
}

interface TabListProps {
  children: ReactNode;
}

interface TabProps {
  children: ReactNode;
}

interface TabPanelProps {
  children: ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ children, activeTab, onChange }) => {
  const tabLists = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === TabList
  );
  
  const tabPanels = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === TabPanel
  );

  return (
    <div className="flex flex-col">
      {React.cloneElement(tabLists[0] as React.ReactElement, { activeTab, onChange })}
      {React.Children.count(tabPanels) > activeTab && tabPanels[activeTab]}
    </div>
  );
};

export const TabList: React.FC<TabListProps & { activeTab?: number; onChange?: (index: number) => void }> = ({ 
  children, 
  activeTab = 0, 
  onChange = () => {} 
}) => {
  return (
    <div className="flex border-b border-gray-200">
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;
        
        return React.cloneElement(child, { 
          isActive: index === activeTab, 
          onClick: () => onChange(index) 
        });
      })}
    </div>
  );
};

export const Tab: React.FC<TabProps & { isActive?: boolean; onClick?: () => void }> = ({ 
  children, 
  isActive = false, 
  onClick = () => {} 
}) => {
  return (
    <button
      className={`px-4 py-3 font-medium text-sm focus:outline-none transition-all duration-200 ${
        isActive 
          ? "text-blue-600 border-b-2 border-blue-600" 
          : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const TabPanel: React.FC<TabPanelProps> = ({ children }) => {
  return <div className="p-0">{children}</div>;
};