import { Metadata } from 'next'
import React from 'react'

type tProps = {
    children: React.ReactNode,
}


export default function layout({ children}: tProps) {
  return (
    <>{children}</>
  )
}
