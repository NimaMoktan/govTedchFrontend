import React from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import CalibrationFeedbackForm from './calibration_feedback_form';

export const metadata: Metadata = {
    title: "BSB | Calibration Feedbacks",
    description:
        "User management for users in the system",
};

const CalibrationFeedback: React.FC = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Calibration Feedback" />
            <div className="flex flex-col gap-10">
                <CalibrationFeedbackForm/>
            </div>
        </DefaultLayout>

    );
};

export default CalibrationFeedback