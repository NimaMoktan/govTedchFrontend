"use client";

import { useState } from "react";
import { FaUser } from "react-icons/fa";
import Input from "@/components/Inputs/Input";
import InputTextArea from "@/components/Inputs/InputTextArea";
import { Formik, Form } from "formik";

const PersonalDashboard = () => {
  return (
    <Formik
      initialValues={{ name: "" }}
      onSubmit={(values) => console.log(values)}
    >
      <Form>
        <div className="min-h-screen ">
          <div className="overflow-hidden rounded-xl bg-white shadow-md">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-500 to-red-500 p-6">
              <div className="flex flex-col items-center sm:flex-row">
                <div className="relative ">
                  <FaUser size={80} color="white" />
                </div>
                <div className="relative ml-10 ">
                  <div className="w-full ">
                    <Input name="username" label="User Name" disabled={true} />
                  </div>
                  <div className="w-full ">
                    <Input
                      name="email"
                      label="dsa"
                      placeholder="Enter your Email here...."
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
              {/* Personal Information Section */}
              <div className="mb-8">
                <h2 className="mb-4 border-b pb-2 text-2xl font-semibold text-gray-800">
                  Personal Information
                </h2>
                <div className="-mt-2 space-y-4 p-4 md:p-5">
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <Input name="first_name" label="First Name" />
                    </div>

                    <div className="w-full xl:w-1/2">
                      <Input name="last_name" label="First Name" />
                    </div>

                    <div>
                      <div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Last Name
                          </label>
                          <input
                            type="email"
                            name="email"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Email ID
                          </label>
                          <input type="tel" name="phone" />
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input type="tel" name="phone" />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            CID Number
                          </label>
                          <input type="text" name="location" />
                        </div>
                      </div>
                    </div>
                    {/* Bio Section */}
                    <div className="mb-8">
                      <h2>Bio</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Formik>
  );
};

export default PersonalDashboard;
