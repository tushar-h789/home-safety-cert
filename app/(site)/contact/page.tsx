import CommonBanner from '@/app/_components/common-banner'
import React from 'react'
import ContactPageForm from './_components/contact-page-form'

export default function Contact() {
  return (
    <>
      <CommonBanner heading='Contact' firstPageName='Home' secondPageName='Contact'/>
      <ContactPageForm/>
    </>
  )
}
