'use client'
import React, { useEffect } from 'react'
import { fileData, tFriend } from '../profilesDb/profile.schema'

import Image from 'next/image'
import DownloadDark from '../../public/downloadDark.svg'
import Share from '../../public/share.svg'
import fs from 'fs'
import { signal } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'
// import { userSignalState } from '../_utils/context'
const linkSignal = signal<HTMLAnchorElement[]>([])
// const loading = signal<boolean>(false)
import Loading from '../_components/loading'
import { handleDownload } from './downloads'
import { backend } from './environmentVariable'
const loading = signal<boolean>(false)
const handleSelectClick = async (videoIndex:number, newViewerUserIndex:string, userIndex: string) => {
  try {
      // const element = event.target as HTMLSelectElement
      // const newViewerUserIndex = value
      //console.log(newViewerUserIndex);
      if( newViewerUserIndex==='-1') return
      const result = await fetch(`${backend}/addAViewerToFile?userIndex=${userIndex}&newViewerUserIndex=${newViewerUserIndex}&videoIndex=${videoIndex}`, {
          method: 'POST',
      })
      if(  !result.ok ) {
          //console.log(`coludnt share file`);
          return
      }
      //console.log('updated successfully');
  } catch (error: Error | any) {
    throw new Error(`Error at handleSlectCLick: ${error}`)
  }
}
export default function card({ file, index, userIndex, freinds }: {file: fileData, userIndex:string, freinds: tFriend[], index: number}) {
    const thumbnail = file.fileDescription.thumbnail
    const transcript = file.fileDescription.transcript
    // async function handleDownload() {
    //     try {
    //       loading.value=true
    //       const response = await fetch(`http://localhost:8000/getFile?fileName=${file.fileLink}`,{ method: 'GET'});
    //       const blob = await response.blob();
    //       //console.log(blob.size);
    //       const url = window.URL.createObjectURL(blob);
    //       const link = document.createElement('a');
    //       link.href = url;
    //       link.setAttribute('download', file.fileLink);
    //       document.body.appendChild(link);
    //       link.click();
    //       linkSignal.value = [...linkSignal.value,link]
    //       loading.value = false
    //     //   document.body.removeChild(link);
    //     } catch (error) {
    //       console.error('Error downloading file:', error);
    //     }
    //   }
      useEffect(() =>{
        return () =>{
            linkSignal.value.forEach( (link) => {
                document.body.removeChild(link)
            })
        }
      },[])
        useSignals()
      const handleCreatePublicLink = async () => {
        try {
            const result = await fetch(`${backend}/createPublicLink?fileName=${file.fileLink}`,{method:'GET'})
            if(!result) throw new Error(`PRoblem creatn g new Link`)
            const value = await result.json()
            if(!value.ok) throw new Error(`Error at creating public code`)
            //console.log(value.url);
            navigator.clipboard.writeText(value.url)
        } catch (error) {
            
        }
      }
      
    //   const handleFileCilck = (event: React.MouseEvent<HTMLDivElement>) => {
    //     const value = event.target as HTMLDivElement
    //     if( isNaN(Number(value))) throw new Error(`Error at handleFileClick`)
    //     const index = String(value.getAttribute('data-index'))
    //     const newSet = new Set([...fileSignal.value])
    //     newSet.add(index)
    //     fileSignal.value = Array.from(newSet)
    //   }
  return <div className="w-64 h-80 rounded-lg" style={{overflow:'hidden',}} >
        { !thumbnail ? <div className='w-full h-3/6'></div> : <img className={`w-full h-3/6 object-cover object-center`} src={thumbnail} alt="Card image"/>}
        <div className="p-4 border-t-2 border-black">
        {/* <h2 className="text-xl font-semibold text-gray-800 mb-2">{file.}</h2> */}
        <p className="">{transcript.length > 10 ? transcript.substring(0,10) : transcript }</p>
        </div>
        <div className="px-4 pb-4 relative">
            <div className='outline-none hover:cursor-pointer hover:outline-blue-300  flex justify-center content-center' onClick={async() => { loading.value = true;await handleDownload(file.fileLink);loading.value=false;}}>Download<Image src={DownloadDark} alt='download' height={0} width={0}/>{ loading.value ? <Loading/>: null}</div>
            <div className='outline-none hover:cursor-pointer hover:outline-blue-300  flex justify-center content-center'>Share with &nbsp;<select className='rounded-lg overflow-hidden' defaultValue={-1} onClick={async (event: React.MouseEvent<HTMLSelectElement>) => {const element = event.target as HTMLSelectElement;await handleSelectClick(Number(index),element.value,userIndex)}} >
            <option value={-1} >Default</option>
                {freinds.map( (freind,index) => {
                const {username,} = freind
                //console.log(freind);
                return <option key={index} value={freind.userIndex}>{username}</option>
                })}
            </select><Image src={Share} alt='download' height={0} width={0} /></div>
            <div className='outline-none hover:cursor-pointer hover:outline-blue-300  flex justify-center content-center' onClick={handleCreatePublicLink}>Create Public Link<Image src={Share} alt='download' height={0} width={0} /></div>
        </div>
        
    </div>
}
/*

        <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <img className="w-full h-full object-cover object-center" src="https://via.placeholder.com/150" alt="Card image"/>
            <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Card Title</h2>
            <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus convallis, libero eu aliquet accumsan, velit leo lacinia erat, vitae vehicula risus nisi at lectus.</p>
            </div>
            <div className="px-4 pb-4">
            <a href="#" className="text-blue-500 font-semibold">Read more</a>
            </div>
        </div> */