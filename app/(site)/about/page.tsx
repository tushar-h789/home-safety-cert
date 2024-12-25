import React from 'react'
import Banner from './_components/banner'
import SafetyCertification from './_components/safety-certifications'
import HelpSection from './_components/help'
import QuestionSection from './_components/question-section'

export default function About() {
  return (
    <div>
      <Banner/>
      <SafetyCertification/>
      <HelpSection/>
      <QuestionSection/>
    </div>
  )
}
