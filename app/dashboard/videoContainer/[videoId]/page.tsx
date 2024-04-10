import Modal from '@/app/_components/modal'

type tpage = {
  params: {
    videoId: string
  }
}

export default function page({ params: { videoId}}: tpage) {
    //console.log('no modal');
  return (
    <div>page: {videoId}</div>
  ) 
}
