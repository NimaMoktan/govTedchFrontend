import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusProps {
    code: number;
    label?: string;
}

const Status: React.FC<StatusProps> = ({ code, label }) => {
    const getStatusColor = (code: number) => {
        switch (code) {
            // Draft - Neutral gray
            case 1000:
                return 'bg-gray-500 text-white';
            
            // Submitted - Light blue (awaiting action)
            case 1001:
                return 'bg-blue-400 text-white';
            
            // Verified - Teal (positive but intermediate state)
            case 1002:
                return 'bg-teal-500 text-white';
            
            // Approved - Green (success/completed)
            case 1003:
                return 'bg-green-500 text-white';
            
            // Reviewed - Indigo (professional/technical action)
            case 1004:
                return 'bg-indigo-500 text-white';
            
            // Assigned - Purple (task assigned)
            case 1005:
                return 'bg-purple-500 text-white';
            
            // Tested - Light green (testing completed)
            case 1006:
                return 'bg-emerald-500 text-white';
            
            // Analyzed - Dark blue (technical processing)
            case 1007:
                return 'bg-blue-600 text-white';
            
            // Pending Payment - Amber (awaiting payment)
            case 1008:
                return 'bg-amber-500 text-white';
            
            // Payment Paid - Emerald (financial success)
            case 1009:
                return 'bg-emerald-600 text-white';
            
            // Send for Re-test - Orange (needs attention)
            case 1010:
                return 'bg-orange-500 text-white';
            
            // Rejected - Red (error/failure)
            case 1011:
                return 'bg-red-500 text-white';
            
            default:
                return 'bg-gray-500 text-white';
        }
    };

    return (
        <Badge className={`items-center ${getStatusColor(code)}`}>
            <span>{label}</span>
        </Badge>
    );
};

export default Status;