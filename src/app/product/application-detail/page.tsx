"use client";
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Registration } from '@/types/product/Product';
import { getProductByAppNumber, claimApplication } from '@/services/product/ProductService';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { HasRole } from '@/context/PermissionContext';
import Status from '@/components/Status/Status';
import SampleReceptionistForm from './SampleReceptionist';
import { Skeleton } from '@/components/ui/skeleton';
import TechniciantForm from './TechnicianForm';
import HeadForm from './HeadForm';

const AppDetailsPage: React.FC = () => {
    const [appDetails, setAppDetails] = useState<Registration | null>(null);
    const [defaultAccordionValue, setDefaultAccordionValue] = useState<string>("item-0");
    const [storedRoles, setStoredRoles] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [hasAutoClaimed, setHasAutoClaimed] = useState(false);

    const searchParams = useSearchParams();
    const applicationNumber = searchParams.get("applicationNumber");

    const fetchAppDetails = useCallback(async (shouldClaim: boolean = false) => {
        if (!applicationNumber) return;

        setIsLoading(true);
        try {
            const res = await getProductByAppNumber(applicationNumber);
            const { data } = res.data;

            if (shouldClaim && data?.statusId === 1001 && !hasAutoClaimed) {
                try {
                    await claimApplication({
                        id: data?.id ?? 0,
                        applicationNumber,
                        serviceId: Number(data?.serviceId) ?? 0,
                        statusId: data?.statusId ?? 0,
                        parameter: "",
                        taskStatusId: data?.taskStatusId ?? 0,
                    });
                    setHasAutoClaimed(true);
                } catch (claimError) {
                    console.error("Claim error:", claimError);
                    setAppDetails(data);
                }
            } else {
                setAppDetails(data || null);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    }, [applicationNumber, hasAutoClaimed]);

    useEffect(() => {
        const roles = localStorage.getItem("roles");
        if (roles) {
            try {
                const parsedRoles = Array.isArray(roles) ? roles : JSON.parse(roles);
                setStoredRoles(parsedRoles);
            } catch (e) {
                console.error("Error parsing roles:", e);
            }
        }

        fetchAppDetails(true); // Auto-claim if needed
    }, [fetchAppDetails]);

    if (isLoading) {
        return (
          <DefaultLayout>
            <Breadcrumb parentPage='Product' pageName="Application Details" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5 space-y-4">
              {/* Main card skeleton */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                  
                  {/* User info skeletons - shown conditionally */}
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item}>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-5 w-36" />
                    </div>
                  ))}
                </div>
              </div>
      
              {/* Sample items skeletons */}
              {[1].map((sample) => (
                <div key={sample} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-56" />
                      <Skeleton className="h-4 w-72" />
                    </div>
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                  
                  {/* Accordion content skeleton */}
                  <div className="mt-4 grid grid-cols-3 gap-4 pt-4">
                    {[1, 2, 3, 4, 5, 6].map((field) => (
                      <div key={field}>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </DefaultLayout>
        );
      }

    if (!appDetails) {
        return (
            <DefaultLayout>
                <Breadcrumb parentPage='Product' pageName="Application Details" />
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
                    <div className="text-center py-10">
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            No application details found
                        </p>
                    </div>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <Breadcrumb parentPage='Product' pageName="Application Details" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Application Number
                            </label>
                            <div className="text-lg font-bold text-gray-800 dark:text-white">
                                {applicationNumber?.toUpperCase()} <Status code={appDetails?.statusId ?? 0} label={appDetails?.status} />
                            </div>
                        </div>
                        <HasRole hasRoles={storedRoles} roles={["THT", "ADM", "SRP", "DIR", "MLD"]}>
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    CID Number
                                </label>
                                <div className="text-base font-medium text-gray-800 dark:text-white">
                                    {appDetails?.cid}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Full Name
                                </label>
                                <div className="text-base font-medium text-gray-800 dark:text-white">
                                    {appDetails?.name}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Contact Number
                                </label>
                                <div className="text-base font-medium text-gray-800 dark:text-white">
                                    {appDetails?.contactNumber}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Email Address
                                </label>
                                <div className="text-base font-medium text-gray-800 dark:text-white">
                                    {appDetails?.emailAddress}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Organization
                                </label>
                                <div className="text-base font-medium text-gray-800 dark:text-white">
                                    {appDetails?.organizationDetails?.description}
                                </div>
                            </div>
                        </HasRole>


                    </div>
                </div>

                {appDetails?.productDetailsEntities?.map((item, index) => (
                    <div key={index} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900 mt-4">
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                            value={defaultAccordionValue}
                            onValueChange={setDefaultAccordionValue}
                        >
                            <AccordionItem value={`item-${index}`} className="border-0">
                                <AccordionTrigger className="[&[data-state=open]>svg:last-child:rotate-180 [&[data-state=open]]:no-underline hover:no-underline">
                                    <h2>
                                        <span className="text-xl font-bold text-gray-800 dark:text-white">
                                            Sample - {index + 1}
                                        </span>
                                        <span className="text-lg text-gray-500 dark:text-gray-400 ml-2">
                                            ({item?.sampleTestType?.description} ({item?.sampleTestType?.code}) -
                                        </span>
                                        <span className="text-lg text-gray-500 dark:text-gray-400 ml-2">
                                            {item?.productTestType?.description} ({item?.productTestType?.code}))
                                        </span>
                                    </h2>
                                </AccordionTrigger>
                                <AccordionContent className="pt-4">
                                    <div className="grid grid-cols-3 gap-2">
                                        {/* Sample details fields */}
                                        <div>
                                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Sample Test Type
                                            </label>
                                            <div className="text-base font-medium text-gray-800 dark:text-white">
                                                {`${item?.sampleTestType?.description} (${item?.sampleTestType?.code})`}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Test Type
                                            </label>
                                            <div className="text-base font-medium text-gray-800 dark:text-white">
                                                {`${item?.productTestType.description} (${item.productTestType.code})`}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Source of Sample
                                            </label>
                                            <div className="text-base font-medium text-gray-800 dark:text-white">
                                                {`${item?.sourceOfSample}`}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Type of Work
                                            </label>
                                            <div className="text-base font-medium text-gray-800 dark:text-white">
                                                {`${item?.typeOfWork}`}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Rate
                                            </label>
                                            <div className="text-base font-medium text-gray-800 dark:text-white">
                                                {item?.productTestType.rateNu}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Quantity
                                            </label>
                                            <div className="text-base font-medium text-gray-800 dark:text-white">
                                                {item?.quantity}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Amount (Quantity x Rate)
                                            </label>
                                            <div className="text-base font-medium text-gray-800 dark:text-white">
                                                {item?.amount}
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                ))}

                <HasRole hasRoles={storedRoles} roles={["SRP"]}>
                    {appDetails && (appDetails?.statusId === 1001 || appDetails?.statusId === 1011) && (
                        <SampleReceptionistForm
                            applicationNumber={applicationNumber ?? ''}
                            appDetails={appDetails}
                        />
                    )}
                </HasRole>
                <HasRole hasRoles={storedRoles} roles={["CLO"]}>
                    {appDetails && (
                        <TechniciantForm
                            applicationNumber={applicationNumber ?? ''}
                            appDetails={appDetails}
                        />
                    )}
                </HasRole>
                <HasRole hasRoles={storedRoles} roles={["MLD"]}>
                    {appDetails && (
                        <HeadForm
                            applicationNumber={applicationNumber ?? ''}
                            appDetails={appDetails}
                        />
                    )}
                </HasRole>
            </div>
        </DefaultLayout>
    );
};

export default AppDetailsPage;