import React from 'react'
type tProps = {
    thumbnail:string,fileLink:string, userImage:string,userName:string, transcript: string,
    
}
import Loading from './loading'
const loading = signal<boolean>(false)
import { handleDownload } from './downloads'


export default function sharedCard({thumbnail,fileLink, userImage,userName, transcript}: tProps) {
  //console.log(`transcript: ${userImage}`);
  return (
    <div className="w-64 h-80 rounded-lg overflow-hidden">
        { !thumbnail ? <div className='w-full h-3/6'></div> : <img className={`w-full h-3/6 object-cover object-center`}  src={thumbnail} alt="Card image"/>}
        <div className="p-4 border-t-2 border-black">
        {/* <h2 className="text-xl font-semibold text-gray-800 mb-2">{file.}</h2> */}
        <p className="">{transcript.length > 10 ? transcript.substring(0,18) : transcript }</p>
        </div>
        <div className="px-4 pb-4 relative">
            <div className='outline-none hover:cursor-pointer hover:outline-blue-300  flex justify-center content-center' onClick={async() => { loading.value = true;await handleDownload(fileLink);loading.value=false;}}>Download<Image src={DownloadDark} alt='download' height={0} width={0}/>{ loading.value ? <Loading/>: null}</div>
        </div>
        <div className='flex justify-start content-center gap-3'><Image src={userImage} alt='download' height={50} width={50} />{userName}</div>        
    </div>
  )
}
import Image from 'next/image';
import { signal } from '@preact/signals-react';
import DownloadDark from '../../public/downloadDark.svg'
