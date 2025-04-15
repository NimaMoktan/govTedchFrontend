import React, { Suspense} from 'react';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DetailForm from './detail-form';
import { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
    title: "BSB | Application Details",
    description:
        "Application Details Page",
};

const ApplicationDetailsPage: React.FC = () => {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Application Details" />
            <ToastContainer/>
            <div className="flex flex-col gap-10">
                <Suspense>

                <DetailForm/>
                </Suspense>
            </div>
            
        </DefaultLayout>
    );
};

export default ApplicationDetailsPage;