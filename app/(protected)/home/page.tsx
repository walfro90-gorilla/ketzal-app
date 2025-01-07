import { ChartAreaStacked } from '@/components/chart-area-stacked'
import { ChartPieDonut } from '@/components/chart-pie-donut-text'
import { ChartRadialText } from '@/components/chart-radial-text'
import React from 'react'
import styles from './HomePageAdmin.module.css'
import { ChartRadialStacked } from '@/components/chart-radial-stacked'

const HomePageAdmin = () => {
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
