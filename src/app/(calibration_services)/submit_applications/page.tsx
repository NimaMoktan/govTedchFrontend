import React from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import ApplicationSubmitForm from './application_form';

export const metadata: Metadata = {
    title: "BSB | Application Form",
    description:
        "User management for users in the system",
};

const ApplicationForm: React.FC = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Calibration Application Form" />
            <div className="flex flex-col gap-10">
                <ApplicationSubmitForm/>
            </div>
        </DefaultLayout>

    );
};

export default ApplicationForm;