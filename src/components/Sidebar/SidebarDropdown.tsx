import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillCheckCircle } from "react-icons/ai";

const SidebarDropdown = ({ item, assignRoles }: any) => {
  const pathname = usePathname();

  return (
    <>
      <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-3">
        {item.map((item: any, index: number) => (
          <li key={index}>
            <Link
              href={item.route}
              className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium text-bodydark2 transition-all duration-300 ease-in-out hover:bg-gray-600 hover:text-white ${
                pathname === item.route ? "bg-gray-600 text-white" : ""
              }`}
            >
              <AiFillCheckCircle
                className="text-white transition-transform duration-300 group-hover:scale-110"
                size={16}
              />
              <span className="transition-all duration-300 group-hover:translate-x-1">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SidebarDropdown;
