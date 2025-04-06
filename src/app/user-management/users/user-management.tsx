"use client";
import { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import { DataTable } from "./table";
import { columns } from "./columns";
import { Card, CardContent} from '@/components/ui/card';
// import { User } from '@/types/User';
import { getUsers } from '@/services/UserService';

const UserManagement = () => {

  const [usersList, setUsersList] = useState<any[]>([]);

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const handleCreateUser = () => {
    setSelectedUser(null);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
  };

  const fetchUsers = async () => {
    try {
      await getUsers().then((response) => {
        setUsersList(response.data);
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, [selectedUser]);

  
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
      <Card className="w-full">
        <CardContent className="max-w-full overflow-x-auto">
          <DataTable columns={columns(handleEditUser, handleDelete)} data={usersList} handleAdd={handleCreateUser} />
        </CardContent>
      </Card >
  );
};

export default UserManagement;
