"use client";
import React, { useEffect, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from './table';
import { columns } from "./columns";
import { Registration } from '@/types/product/Product';
import { getProducts } from '@/services/product/ProductService';
import { useLoading } from '@/context/LoadingContext';

const ProductPage = () => {
    const [productList, setProductList] = useState<Registration[]>([]);
    const { setIsLoading} =useLoading();

    const handleEdit = () => {

    }

    const handleDelete = () => {

    }

    useEffect(()=>{

        const fetchProducts = async() => {
            setIsLoading(true)
            const response = await getProducts().finally(() => setIsLoading(false));
            setProductList(response.data);
        }

        fetchProducts()

    },[setIsLoading])

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Product Application List" parentPage='Products' />
            <div className="flex flex-col gap-2">
                <Card className="w-full">
                    <CardContent className="max-w-full overflow-x-auto">
                        <DataTable
                            columns={columns(handleEdit, handleDelete)}
                            data={productList}
                        />
                    </CardContent>
                </Card>
            </div>
        </DefaultLayout>

    );
};

export default ProductPage;