'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
export default function notFound() {
  const router = useRouter()
  useEffect(()=>{

    router.push('/signup')
  }, [])
  return (
    <div>not-found</div>
  )
}
