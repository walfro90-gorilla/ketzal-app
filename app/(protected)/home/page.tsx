'use client'
import React, { useEffect } from 'react'
import { useLoading } from '@/components/LoadingContext'
import { ChartAreaStacked } from '@/components/chart-area-stacked'
import { ChartPieDonut } from '@/components/chart-pie-donut-text'
import { ChartRadialText } from '@/components/chart-radial-text'
import styles from './HomePageAdmin.module.css'
import { ChartRadialStacked } from '@/components/chart-radial-stacked'

const HomePageAdmin = () => {
  const { setLoading } = useLoading()

  useEffect(() => {
    setLoading(true)
    // Simula carga de datos, reemplaza por tu fetch real si es necesario
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [setLoading])

  return (
    <>

      <div className={styles.gridContainer}>
        <ChartPieDonut />
        <ChartRadialText />
        <ChartRadialStacked/>
      </div>
        <ChartAreaStacked />

    </>
  )
}

export default HomePageAdmin
