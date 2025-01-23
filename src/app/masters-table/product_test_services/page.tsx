import React from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import ProductTable from './product_services_table'
export const metadata: Metadata = {
    title: "Masters | Product Test Services",
    description:
        "Product Test Services Table",
};

const ProductServices: React.FC = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Product Services" />
            <div className="flex flex-col gap-10">
                < ProductTable />
            </div>
        </DefaultLayout>

    );
};

export default ProductServices;