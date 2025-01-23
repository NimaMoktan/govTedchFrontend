import React from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import CodeMaintenanceTable from './code_maintenance_table';

export const metadata: Metadata = {
    title: "Masters | Code Maintenances Services",
    description:
        "Code Maintenances Table",
};

const CodeMaintenance: React.FC = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Code Maintenances" />
            <div className="flex flex-col gap-10">
                < CodeMaintenanceTable />
            </div>
        </DefaultLayout>

    );
};

export default CodeMaintenance;