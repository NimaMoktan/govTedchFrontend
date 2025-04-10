import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DetailForm from './detail-form';
import { ToastContainer } from 'react-toastify';
import { Suspense } from 'react';

const ApplicationDetailsPage: React.FC = () => {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Application Details" />
            <ToastContainer/>
            <Suspense fallback={<div>Loading...</div>}>
                <DetailForm/>
            </Suspense>
            
        </DefaultLayout>
    );
};

export default ApplicationDetailsPage;