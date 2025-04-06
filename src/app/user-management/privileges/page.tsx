"use client"
import { useEffect } from 'react'
import { useLoading } from '@/context/LoadingContext'
// import Records from './records'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'

export default function Page() {

  const { setIsLoading } = useLoading()

  useEffect(() => {
    setIsLoading(true)
  }, [setIsLoading])

  return (
      <DefaultLayout>
        <Breadcrumb pageName="Privileges" parentPage='User Management'/>
        
      </DefaultLayout>
  )
}
