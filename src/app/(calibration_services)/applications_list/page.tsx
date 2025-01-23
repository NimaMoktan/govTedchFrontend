import React from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import ApplicationListTable from '@/components/Tables/ApplicationListTable';

export const metadata: Metadata = {
    title: "BSB | Application Lists",
    description:
        "User management for users in the system",
};

const ApplicationList: React.FC = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Application List" />
            <div className="flex flex-col gap-10">
                <ApplicationListTable/>
            </div>
        </DefaultLayout>

    );
};

export default ApplicationList;