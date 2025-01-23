import React from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import ServiceTypeTable from './status_table';

export const metadata: Metadata = {
    title: "Masters | Status",
    description:
        "Service Test Table",
};

const CodeMaintenance: React.FC = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Status" />
            <div className="flex flex-col gap-10">
                < ServiceTypeTable />
            </div>
        </DefaultLayout>

    );
};

export default CodeMaintenance;