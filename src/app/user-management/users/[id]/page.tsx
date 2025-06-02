"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Formik, Form, FormikState } from "formik";
import * as Yup from "yup";
import MultiSelect from "@/components/Inputs/MultiSelect";
import Input from "@/components/Inputs/Input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { getUser, updateUser } from "@/services/UserService";
import { getRoleDropdowns } from "@/services/RoleService";
import { User } from "@/types/User";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import SelectDropDown from "@/components/Inputs/Select";

interface RoleDropdown {
  value: string;
  text: string;
}

const UsersEdit = ({ params }: { params: { id: string } }) => {
  const { setIsLoading, isLoading } = useLoading();
  const [roleDropdown, setRoleDropdown] = useState<RoleDropdown[]>([]);
  const [initialValues, setInitialValues] = useState<User>({
    id: 0,
    username: "",
    cid: "",
    first_name: "",
    last_name: "",
    email: "",
    mobile_no: "",
    role_ids: [],
    is_active: true,
  });
  const [roleList, setRoleList] = useState<RoleDropdown[]>([]);
  const router = useRouter();

  const handleSubmit = async (
    values: User,
    {
      resetForm,
    }: { resetForm: (nextState?: Partial<FormikState<User>>) => void },
  ) => {
    setIsLoading(true);
    try {
      const response = await updateUser(values.id, values);
      toast.success(response.data.message, {
        duration: 1500,
        position: "top-right",
      });
      setTimeout(() => {
        router.push("/user-management/users");
      }, 2000);
      resetForm();
    } catch (error) {
      console.error("ERROR", error);
      toast.error("Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch role list
        const rolesResponse = await getRoleDropdowns();
        if (Array.isArray(rolesResponse.data)) {
          const roleOptions = rolesResponse.data.map(
            (role: { id: any; name: any }) => ({
              value: String(role.id),
              text: role.name,
            }),
          );
          setRoleDropdown([{ value: "", text: "Select Role" }, ...roleOptions]);
        }

        // Fetch user data by ID
        if (params.id) {
          const userResponse = await getUser(Number(params.id));
          console.log("Fetched user data:", userResponse.data);

          const userData = userResponse.data;
          if (!userData) throw new Error("User data not found");

          setInitialValues({
            id: userData?.id,
            username: userData.username ?? "",
            cid: userData.cid ?? "",
            first_name: userData.first_name ?? "",
            last_name: userData.last_name ?? "",
            email: userData.email ?? "",
            mobile_no: userData.mobileNumber ?? "",
            role_ids:
              userData.userRole?.map((role: any) => role.roles.id.toString()) ??
              [],
            is_active: userData.active === true,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      getRoleDropdowns().then((response) => {
        console.log(response.data);
        const optionList = response.data.map((role: any) => ({
          value: String(role.id),
          text: role.name,
        }));
        console.log(optionList);
        setRoleList(optionList);
      });
    };
    fetchRoles();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb parentPage="User Management" pageName="Edit User" />
      <Card className="min-h-screen w-full">
        <CardContent className="min-h-screen max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={Yup.object({
                username: Yup.string()
                  .required("Username is required")
                  .min(3, "Must be at least 3 characters"),
                cid: Yup.string()
                  .required("CID is required")
                  .min(11, "Must be at least 11 characters"),
                first_name: Yup.string()
                  .required("First name is required")
                  .min(3, "Must be at least 3 characters"),
                last_name: Yup.string()
                  .required("Last name is required")
                  .min(3, "Must be at least 3 characters"),
                email: Yup.string()
                  .required("Email is required")
                  .email("Invalid email format"),
                mobile_no: Yup.string()
                  .required("Mobile number is required")
                  .min(8, "Enter at least 8 digits"),
                role_ids: Yup.array().min(1, "At least one role is required"),
              })}
              onSubmit={handleSubmit}
            >
              <Form>
                <div className="-mt-2 space-y-4 p-4 md:p-5">
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    {/* <div className="w-full xl:w-1/2">
                      <MultiSelect
                        label="Role"
                        name="role_ids"
                        options={roleDropdown}
                      />
                    </div> */}
                    <div className="w-full xl:w-1/2">
                      <SelectDropDown
                        label="Select Role"
                        name="role"
                        options={roleList}
                      />
                    </div>
                  </div>
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <Input
                        label="First Name"
                        name="first_name"
                        placeholder="Enter first name"
                        autoComplete="off"
                        type="text"
                      />
                    </div>
                    <div className="w-full xl:w-1/2">
                      <Input
                        label="Last Name"
                        name="last_name"
                        placeholder="Enter last name"
                        autoComplete="off"
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <Input
                        label="Username"
                        name="username"
                        placeholder="Enter username"
                        type="text"
                      />
                    </div>
                    <div className="w-full xl:w-1/2">
                      <Input
                        label="CID"
                        name="cid"
                        placeholder="Enter CID"
                        autoComplete="off"
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <Input
                        label="Email"
                        name="email"
                        placeholder="Enter email address"
                        type="email"
                      />
                    </div>
                    <div className="w-full xl:w-1/2">
                      <Input
                        label="Phone Number"
                        name="mobile_no"
                        placeholder="Enter phone number"
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="rounded-full"
                    >
                      {isLoading ? "Updating..." : "Update"}
                    </Button>
                    <Link href="/user-management/users">
                      <Button variant="destructive" className="rounded-full">
                        Back
                      </Button>
                    </Link>
                  </div>
                </div>
              </Form>
            </Formik>
          </div>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
};

export default UsersEdit;
