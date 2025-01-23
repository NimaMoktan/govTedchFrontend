"use client";
import {useCallback, useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { BsPencil, BsTrash } from "react-icons/bs";
import Swal from "sweetalert2";
import Input from "@/components/Inputs/Input";

const CodeMaintenanceTable = () => {

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="flex justify-between items-center mb-5">
                <h1>Code Maintenance</h1>
                
            </div>
        </div>
    );
};

export default CodeMaintenanceTable;
