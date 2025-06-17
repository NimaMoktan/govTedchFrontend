"use client";

import { useState } from "react";
import { FaUser } from "react-icons/fa";
import Input from "@/components/Inputs/Input";
import InputTextArea from "@/components/Inputs/InputTextArea";
import { Formik, Form } from "formik";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const PersonalDashboard = () => {
  return (
    <Formik
      initialValues={{ name: "" }}
      onSubmit={(values) => console.log(values)}
    >
      <Form>
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 p-6">
          <div className="overflow-hidden rounded-xl bg-white shadow-md">
            {/* Header Section */}
            <div className="bg-red-300 p-6 ">
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
            <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start">
              {/* Left Side - Personal Information */}
              <div className="w-full rounded-xl bg-white/90 p-6 shadow-lg lg:w-2/3">
                <h2 className="mb-6 border-b-2 border-indigo-100 pb-3 text-2xl font-bold tracking-tight text-gray-800">
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full">
                      <Input name="email" label="Email ID" />
                    </div>
                  </div>
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <Input name="first_name" label="First Name" />
                    </div>
                    <div className="w-full xl:w-1/2">
                      <Input name="last_name" label="Last Name" />
                    </div>
                  </div>
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <Input name="cid_number" label="CID NO" />
                    </div>
                    <div className="w-full xl:w-1/2">
                      <Input name="phone_number" label="Phone Number" />
                    </div>
                  </div>
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full">
                      <label
                        htmlFor="bio"
                        className="mb-1 block font-medium text-gray-700"
                      >
                        Bio
                      </label>
                      <Textarea name="bio" id="bio" />
                    </div>
                  </div>
                  <Button className="bg-red-700">Save Changes</Button>
                </div>
              </div>

              {/* Right Side - Account Analytics */}
              <div className="w-full rounded-xl bg-white/90 shadow-lg lg:w-1/3">
                <h2 className="mb-6 mt-6 border-b-2 border-indigo-100 pb-3 text-center text-2xl font-bold tracking-tight text-gray-800">
                  Account Analytics
                </h2>
                <div className="mb-6 w-full">
                  <h2>Filter by</h2>
                  <select className="w-full rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-indigo-500">
                    <option value="today">Today</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>

                <div className="overflow-hidden bg-white">
                  <table className="min-w-full table-auto text-left text-sm font-medium text-gray-800">
                    <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                      <tr>
                        <th className="bg-indigo-100/50 px-6 py-4 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                          Descriptions
                        </th>
                        <th className="bg-teal-100/50 px-6 py-4 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                          Statistics
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="transition-all duration-200 hover:bg-gray-50">
                        <td className="bg-indigo-50/30 px-6 py-4 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                          No of Calls
                        </td>
                        <td className="bg-teal-50/30 px-6 py-4 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                          10
                        </td>
                      </tr>
                      <tr className="transition-all duration-200 hover:bg-gray-50">
                        <td className="bg-indigo-50/30 px-6 py-4 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                          No of Emails
                        </td>
                        <td className="bg-teal-50/30 px-6 py-4 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                          20
                        </td>
                      </tr>
                      <tr className="transition-all duration-200 hover:bg-gray-50">
                        <td className="bg-indigo-50/30 px-6 py-4 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                          Turnaround Time
                        </td>
                        <td className="bg-teal-50/30 px-6 py-4 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                          20 Minutes
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
