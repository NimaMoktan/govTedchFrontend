import React from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import SampleTestTable from './sample_test_table';

export const metadata: Metadata = {
    title: "Masters | Sample Test Services",
    description:
        "Sample Test Services Table",
};

const CodeMaintenance: React.FC = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Sample Test" />
            <div className="flex flex-col gap-10">
                < SampleTestTable />
            </div>
        </DefaultLayout>

    );
};

export default CodeMaintenance;