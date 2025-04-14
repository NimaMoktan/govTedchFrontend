"use client";
import { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import { DataTable } from "./table";
import { columns } from "./columns";
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation'; // Changed from 'next/router'
import { getUsers } from '@/services/UserService';
import { User } from '@/types/User';
import { useLoading } from '@/context/LoadingContext';

const UserManagement = () => {
  const [usersList, setUsersList] = useState<User[]>([]);
  const router = useRouter();
  const { setIsLoading } = useLoading()

  const handleCreateUser = () => {
    router.push('/user-management/users/create'); // Assuming you have a create route
  };

  const handleEditUser = (user: User) => {
    router.push(`/user-management/users/${user.id}`);
  };

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await getUsers().finally(()=>setIsLoading(false));
      setUsersList(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Swal.fire(
        'Error!',
        'Failed to fetch users. Please try again.',
        'error'
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // Removed selectedUser from dependencies to prevent infinite loops

  const handleDelete = async (user: User) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      width: 450,
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/core/user/${user.id}/delete`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete the user');
        }

        setUsersList(prev => prev.filter(item => item.id !== user.id));
        await Swal.fire(
          'Deleted!',
          'The user has been deleted.',
          'success'
        );
      } catch (error) {
        await Swal.fire(
          'Error!',
          'Something went wrong. Please try again.',
          'error'
        );
      }
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="max-w-full overflow-x-auto">
        <DataTable 
          columns={columns(handleEditUser, handleDelete)} 
          data={usersList} 
          handleAdd={handleCreateUser} 
        />
      </CardContent>
    </Card>
  );
};

export default UserManagement;