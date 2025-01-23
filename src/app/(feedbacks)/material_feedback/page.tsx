import React from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import ProductFeedback from './material_feedback_form';

export const metadata: Metadata = {
    title: "BSB | Material Feedbacks",
    description:
        "User management for users in the system",
};

const MaterialFeedback: React.FC = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Material Feedback" />
            <div className="flex flex-col gap-10">
                <ProductFeedback/>
            </div>
        </DefaultLayout>

    );
};

export default MaterialFeedback;