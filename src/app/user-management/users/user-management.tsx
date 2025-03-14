"use client";
import { useState, useEffect } from 'react';
import { Formik, Form, FormikState } from "formik";
import * as Yup from 'yup';
import MultiSelect from "@/components/Inputs/MultiSelect";
import Input from "@/components/Inputs/Input";
import Swal from "sweetalert2";
import { DataTable } from "./table";
import { columns } from "./columns";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Card,
  CardContent} from '@/components/ui/card';

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
  const [usersList, setUsersList] = useState<any[]>([]); // Adjusted type to any for flexibility
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [roleDropdown, setRoleDropdown] = useState<RoleDropdown[]>([])
  const handleCreateUser = () => {
    setSelectedUser(null);
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

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/core/user/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const result = await response.json();
      if (Array.isArray(result.data)) {
        setUsersList(result.data);
      } else {
        setUsersList([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };


  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/core/roles/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch roles');
        }
        const result = await response.json();
        const roleOptions = result?.data?.map((role: { id: number; role_name: string }) => ({
          value: String(role.id),
          text: role.role_name,
        }));
        if (Array.isArray(result.data)) {
          const roleOptions = result.data.map((role: { id: number; role_name: string }) => ({
            value: String(role.id),
            text: role.role_name,
          }));
          setRoleDropdown([{ value: '', text: 'Select Role' }, ...roleOptions]);
        } else {
          console.error('Roles data is not an array:', result.data);
        }
        setRoles([{ value: '', text: 'Select Role' }, ...roleOptions]);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchUsers();
    fetchRoles();
  }, [selectedUser]);

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
        mobileNumber: values.mobile_number,
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
        mobileNumber: values.mobile_number,
        active: "Y",
        userRoles: values.role.map((role) => ({
          id: Number(role),
        })),
      };
    }

    const storedUser = localStorage.getItem("userDetails");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    try {
      const response = await fetch(
        selectedUser
          ? `${process.env.NEXT_PUBLIC_API_URL}/core/user/${selectedUser.id}/update`
          : `${process.env.NEXT_PUBLIC_API_URL}/core/user/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            "userId": parsedUser.id,
            "userName": parsedUser.userName,
          },
          body: JSON.stringify(userData),
        }
      );
      if (!response.ok) {
        const errorResponse = await response.text();

        throw new Error(`${errorResponse}`);
      }

      setShowCreateModal(false);  // Ensure modal is hidden after success
      setShowEditModal(false);    // Ensure modal is hidden after success
      Swal.fire(
        selectedUser ? 'User Updated!' : 'User Created!',
        `The user has been successfully ${selectedUser ? 'updated' : 'created'}.`,
        'success'
      ).then(() => {

      });
      resetForm();
    } catch (error) {
      console.error("ERROR", error);
    }
  };


  const handleDelete = (user: any) => {

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCloseButton: true,
      showConfirmButton: true,
      width: 450,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updatedData = usersList.filter(item => item.id !== user.id);
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/core/user/${user.id}/delete`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setUsersList(updatedData)

          if (!response.ok) {
            throw new Error('Failed to delete the user');
          }

          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          );
        } catch (error) {
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
    <>
      <Dialog open={showCreateModal || showEditModal} onOpenChange={closeModal}>
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
            role: Yup.array().min(1, 'Role is required'),
            mobile_number: Yup.number().required('Mobile Number is required').min(8, 'Enter atleast 8 characters.')
          })}
          onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}  // Pass the handleSubmit here
        >
          <Form>
            <DialogContent className='z-[10000] w-full max-w-5xl'>
              <DialogHeader>
                <DialogTitle>{selectedUser ? "Edit User" : "Create User"}</DialogTitle>
                <DialogDescription>
                  Fill all the required field to create new user
                </DialogDescription>
              </DialogHeader>
              <div className="p-4 md:p-5 space-y-4 -mt-2">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <Input label="CID" type="text" autoComplete="off" placeholder="Enter your CID" name="cid" />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <Input label="Full Name" autoComplete="off" type="text" placeholder="Enter your full name" name="full_name" />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <Input label="Username" type="text" placeholder="Enter username" name="username" />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <Input label="Email" type="email" placeholder="Enter email address" name="email" />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <Input label="Phone Number" type="text" placeholder="Enter phone number" name="mobile_number" />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <MultiSelect label="Role" name="role" options={roleDropdown} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className='rounded-full mx-2'>{selectedUser ? 'Update Update' : 'Create User'}</Button>
                <Button type="button" className='rounded-full mx-2' variant={`destructive`} onClick={closeModal}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Form>
        </Formik>
      </Dialog>
      <Card className="w-full">
        <CardContent className="max-w-full overflow-x-auto">
          <DataTable columns={columns(handleEditUser, handleDelete)} data={usersList} handleAdd={handleCreateUser} />
        </CardContent>
      </Card >
    </>
  );
};

export default UserManagement;
