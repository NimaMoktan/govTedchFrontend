"use client";
// import { Package } from "@/types/package";
// import Link from "next/link";
import { BiUserPlus } from "react-icons/bi";
import { BsPencil, BsTrash } from "react-icons/bs";
import { useState, useEffect } from 'react';
import { Formik, Form, FormikState } from "formik";
import * as Yup from 'yup';
import MultiSelect from "@/components/Inputs/MultiSelect";
import Input from "@/components/Inputs/Input";
import Swal from "sweetalert2";

const UserManagement = () => {
  interface Role {
    id: number;
    code: string;
    role: string;
    role_name: string;
    active: string;
  }

  interface RoleDropdown {
    value: string;
    text: string;
  }

  const [roles, setRoles] = useState<{ value: string; text: string }[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<any[]>([]); // Adjusted type to any for flexibility
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [roleDropdown, setRoleDropdown] = useState<RoleDropdown[]>([])

  const handleCreateUser = () => {
    setSelectedUser(null); // Ensure no data is pre-filled for creating new user
    setShowCreateModal(true);
  };
  
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };
  
  const closeModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
  };
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/core/user/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
  
        const result = await response.json();  
        // Check if 'data' is an array
        if (Array.isArray(result.data)) {
          setUsersList(result.data);  // Set the data to the state if it's an array
        } else {
          console.error('Fetched data is not an array:', result);
          setUsersList([]); // Optionally set an empty array if it's not an array
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchUsers();
  }, [token]);
  

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/core/roles/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch roles');
        }
        const result = await response.json();
        const roleOptions = result?.data?.map((role: { id: number; role_name: string }) => ({
          value: String(role.id),  // Use string values for consistency
          text: role.role_name,
        }));
        console.log("This is the role result: ", result);
        // Map the roles data to the format expected by the Select component
        if (Array.isArray(result.data)) {
          const roleOptions = result.data.map((role: { id: number; role_name: string }) => ({
            value: String(role.id),
            text: role.role_name,
          }));
          setRoleDropdown([{ value: '', text: 'Select Role' }, ...roleOptions]);
        } else {
          console.error('Roles data is not an array:', result.data);
        }                
        // Add a default option at the beginning
        setRoles([{ value: '', text: 'Select Role' }, ...roleOptions]); 
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
  
    fetchRoles();
  }, [token]);
  
  const handleSubmit = async (
    values: {
      username?: string;
      cid: string;
      full_name: string;
      email?: string;
      mobile_number?: string;
      role: string[];
      status?: any;
    },
    resetForm: (nextState?: Partial<FormikState<any>> | undefined) => void
  ) => {
    let userData;
  
    if (selectedUser) {
      userData = {
        cidNumber: values.cid,
        fullName: values.full_name,
        userName: values.username,
        email: values.email,
        mobileNumber: values.mobile_number || null,
        active: "Y",
        userRoles: values.role.map((role) => ({
          id: Number(role),
        })),
      };
    } else {
      userData = {
        cidNumber: values.cid,
        fullName: values.full_name,
        userName: values.username,
        email: values.email,
        mobileNumber: values.mobile_number || null,
        active: "Y",
        userRoles: values.role.map((role) => ({
          id: Number(role),
        })),
      };
    }
  
    // Log the data being sent for debugging purposes
    console.log("Data being sent to API:", JSON.stringify(userData, null, 2));
  
    try {
      const response = await fetch(
        selectedUser
          ? `${process.env.NEXT_PUBLIC_API_URL}/core/user/${selectedUser.id}/update`
          : `${process.env.NEXT_PUBLIC_API_URL}/core/user/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        }
      );
  
      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`Failed to update user: ${errorResponse}`);
      }

      setShowCreateModal(false);  // Ensure modal is hidden after success
      setShowEditModal(false);    // Ensure modal is hidden after success
      Swal.fire(
        selectedUser ? 'User Updated!' : 'User Created!',
        `The user has been successfully ${selectedUser ? 'updated' : 'created'}.`,
        'success'
      ).then(() => {
        window.location.reload();
      });
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error!', `There was an issue ${selectedUser ? 'updating' : 'creating'} the user.`, 'error');
    }
  };
  

  const handleDelete = (index: number) => {
    // Get the selected user based on the index
    const selectedUser = usersList[index];
    console.log("What is this: ", selectedUser);
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCloseButton: true,
      showConfirmButton: true,
      width: 450,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Send DELETE request to the API
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${selectedUser.id}/core/delete`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to delete the user');
          }
  
          // On success, remove the user from the list
          const newList = [...usersList];
          newList.splice(index, 1);
          setUsersList(newList);
  
          // Show success alert
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          );
        } catch (error) {
          // Handle error case
          Swal.fire(
            'Error!',
            'Something went wrong. Please try again.',
            'error'
          );
        }
      }
    });
  };  

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex max-w-full justify-between items-center mb-5 ">
        <h1 className="dark:text-white">User List</h1>
        <button
          onClick={handleCreateUser}
          className="inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-4 xl:px-4"
        >
          <span>
            <BiUserPlus className="text-white" size={20} />
          </span>
          Add User
        </button>
      </div>
      {showCreateModal || showEditModal ? (
        <div
          aria-hidden="false"
          className={`${
            showCreateModal || showEditModal
              ? 'block'
              : 'hidden'
          } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-9999 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out opacity-100`}
        >
          <div className="relative p-4 w-full max-w-5xl max-h-full transition-transform duration-300 ease-in-out transform scale-95">
          <Formik
            initialValues={{
              username: selectedUser?.userName || '',
              cid: selectedUser?.cidNumber || '',
              full_name: selectedUser?.fullName || '',
              email: selectedUser?.email || '',
              mobile_number: selectedUser?.mobileNumber || '',
              role: selectedUser?.userRole?.map((role: any) => role.roles.id.toString()) || [],  // Prepopulate roles
            }}
            validationSchema={Yup.object({
              username: Yup.string().required('Username is required').min(3, 'Must be at least 3 characters'),
              cid: Yup.string().required('CID is required').min(11, 'Must be at least 11 characters'),
              full_name: Yup.string().required('Full name is required').min(3, 'Must be at least 3 characters'),
              email: Yup.string().required('Email address is required').email('Invalid email address'),
              role: Yup.array().min(1, 'Role is required') // Adjust validation to handle array type
            })}
            onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}  // Pass the handleSubmit here
          >
            <Form>
              {/* Form structure here */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedUser ? 'Edit User' : 'Create New User'}
                  </h3>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-4 md:p-5 space-y-4 -mt-2">
                  <Input label="CID" type="text" placeholder="Enter your CID" name="cid" />
                  <Input label="Full Name" type="text" placeholder="Enter your full name" name="full_name" />
                  <Input label="Username" type="text" placeholder="Enter username" name="username" />
                  <Input label="Email" type="email" placeholder="Enter email address" name="email" />
                  <Input label="Phone Number" type="text" placeholder="Enter phone number" name="mobile_number" />
                  <MultiSelect label="Role" name="role" options={roleDropdown} />
                </div>
                <div className="flex justify-between items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5">
                    {selectedUser ? 'Update' : 'Save'}
                  </button>
                  <button type="button" onClick={closeModal} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 bg-white rounded-full border border-gray-200 hover:bg-gray-100">
                    Close
                  </button>
                </div>
              </div>
            </Form>
          </Formik>

          </div>
        </div>
      ) : null}

      <div className="max-w-full overflow-x-auto">
      <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[50px] px-4 py-4 font-medium text-black dark:text-white">SL</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">CID</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Full Name</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Email</th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">Role</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((user, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{key + 1}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">{user.cidNumber}</h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{user.fullName}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{user.email}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {user.userRole && Array.isArray(user.userRole) && user.userRole.length > 0
                      ? user.userRole.map((role: any) => role.roles.role_name).join(', ')
                      : 'No Roles'}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary" onClick={() => handleEditUser(user)}>
                      <BsPencil className="fill-current" size={20} />
                    </button>
                    <button className="hover:text-primary" onClick={() => handleDelete(key)}>
                      <BsTrash className="fill-current" size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default UserManagement;
