import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillCheckCircle } from "react-icons/ai";
import { HasRole } from "@/context/PermissionContext";

const SidebarDropdown = ({ item, assignRoles }: any) => {
  const pathname = usePathname();
  return (
    <>
      <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-3">
        {item.map((item: any, index: number) => (
          <HasRole key={index} roles={item.role} hasRoles={assignRoles}>
           <li>
              <Link
                href={item.route}
                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === item.route ? "text-white" : ""
                  }`}
              >
                <AiFillCheckCircle className="text-white" size={16} />  {item.label}
              </Link>
            </li>
          </HasRole>
        ))}
      </ul>
    </>
  );
};

export default SidebarDropdown;
