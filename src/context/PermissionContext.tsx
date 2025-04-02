"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface PermissionContextType {
  permissions: string[];
  setPermissions: (permissions: string[]) => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    // Load permissions from localStorage on mount
    const storedPermissions = localStorage.getItem("permissions");
    if (storedPermissions) {
      setPermissions(JSON.parse(storedPermissions));
    }
  }, []);

  const updatePermissions = (newPermissions: string[]) => {
    setPermissions(newPermissions);
    localStorage.setItem("permissions", JSON.stringify(newPermissions));
  };

  return (
    <PermissionContext.Provider value={{ permissions, setPermissions: updatePermissions }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
};

export const HasPermission = ({
  permission,
  children,
}: {
  permission: string;
  children: ReactNode;
}) => {
  const { permissions } = usePermissions();
  return permissions.includes(permission) ? <>{children}</> : null;
};
