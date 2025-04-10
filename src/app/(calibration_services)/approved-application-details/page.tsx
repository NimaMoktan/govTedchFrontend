import React from 'react';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DetailForm from './detail-form';
import { ToastContainer } from 'react-toastify';
import { Suspense } from 'react';

const ApplicationDetailsPage: React.FC = () => {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Application Details" />
            <ToastContainer />
            <div className="flex flex-col gap-10">
                <Suspense fallback={<>Loading....</>}>
                    <DetailForm />
                </Suspense>
            </div>

        </DefaultLayout>
    );
};

export default ApplicationDetailsPage;