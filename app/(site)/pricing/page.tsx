import React from 'react'
import PricingPlans from '../_components/pricing-plans'
import CommonBanner from '@/app/_components/common-banner'
import PricingPageCard from './_components/pricing-card'

export default function Pricing() {
  return (
    <>
    <CommonBanner heading="Pricing" firstPageName="Home" secondPageName="Pricing"/>
      {/* <PricingPlans/> */}
      <PricingPageCard/>
    </>
  )
}
