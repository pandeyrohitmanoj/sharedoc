import React from 'react'
type tpage = {
  params: {
    videoId: string
  }
}

export default function page({ params: { videoId}}: tpage) {
  return (
    <Modal>page: {videoId}</Modal>
  )
}

import Modal from '@/app/_components/modal'