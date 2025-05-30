"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface PermissionContextType {
  permissions: string[];
  roles: string[];
  setPermissions: (permissions: string[]) => void;
  setRoles: (roles: string[]) => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    // Load permissions and roles from localStorage on mount
    const storedPermissions = localStorage.getItem("permissions");
    const storedRoles = localStorage.getItem("roles");

    try {
      if (storedPermissions) {
        setPermissions(JSON.parse(storedPermissions));
      }
      if (storedRoles) {
        const parsedRoles = JSON.parse(storedRoles);
        if (Array.isArray(parsedRoles)) {
          setRoles(parsedRoles);
        } else {
          console.error("Stored roles are not in the expected array format.");
        }
      }
    } catch (error) {
      console.error("Error parsing roles or permissions from localStorage:", error);
    }
  }, []);

  const updatePermissions = (newPermissions: string[]) => {
    setPermissions(newPermissions);
    localStorage.setItem("permissions", JSON.stringify(newPermissions));
  };

  const updateRoles = (newRoles: string[]) => {
    setRoles(newRoles);
    localStorage.setItem("roles", JSON.stringify(newRoles));
  };

  return (
    <PermissionContext.Provider value={{ 
      permissions, 
      roles,
      setPermissions: updatePermissions,
      setRoles: updateRoles
    }}>
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

// Component to check permission
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

// Component to check role
export const HasRole = ({
  roles,
  hasRoles,
  children,
}: {
  roles: string | string[];
  hasRoles: string | string[];
  children: ReactNode;
}) => {
 
    // console.log(hasRoles, "========================", roles) 
  return Array.isArray(hasRoles) && Array.isArray(roles) && roles.some(role => hasRoles.includes(role)) ? <>{children}</> : null;
};

// Combined component that checks either permission or role
export const HasAccess = ({
  permission,
  role,
  children,
}: {
  permission?: string;
  role?: string | string[];
  children: ReactNode;
}) => {
  const { permissions, roles } = usePermissions();
  
  // Check permission first if provided
  if (permission && permissions.includes(permission)) {
    return <>{children}</>;
  }
  
  // Then check role if provided
  if (role) {
    if (Array.isArray(role)) {
      if (role.some(r => roles.includes(r))) {
        return <>{children}</>;
      }
    } else if (roles.includes(role)) {
      return <>{children}</>;
    }
  }
  
  return null;
};