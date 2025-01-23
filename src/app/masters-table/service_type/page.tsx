import React from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import ServiceTypeTable from './service_type_table';

export const metadata: Metadata = {
    title: "Masters | Service Test",
    description:
        "Service Test Table",
};

const CodeMaintenance: React.FC = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Sample Test" />
            <div className="flex flex-col gap-10">
                < ServiceTypeTable />
            </div>
        </DefaultLayout>

    );
};

export default CodeMaintenance;