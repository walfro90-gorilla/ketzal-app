"use client"
import { ReactNode } from 'react'
import { useLoading } from '@/components/LoadingContext'
import Loader from '@/components/Loader'

export default function AppWithLoader({ children }: { children: ReactNode }) {
  const { loading } = useLoading()
  return (
    <>
      {loading && <Loader />}
      {children}
    </>
  )
}
