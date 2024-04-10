'use client'
import Image from 'next/image'
import { fileData, tFriend } from '../profilesDb/profile.schema'
import Card from './card'
import { useEffect, useRef } from 'react'

type tProp ={
  files: fileData[],
  freinds: tFriend[],
  userIndex: string,
}
import { signal, userSignalState } from '../_utils/context'
import { useSignals } from '@preact/signals-react/runtime'
const fileSignal = signal<string[]>([])
export default function cardList({ files, freinds, userIndex,  }: tProp) {
  
  return (
    <div className='overflow-auto mt-10'>      
        <div className='min-w-max flex justiy-center align-center gap-6'>
          {files && files.map( (file, index) => {
            return <Card key={index} freinds={freinds} userIndex={userIndex} index={file.fileIndex} file={file}/>
          })}                 
        </div>
    </div>
  )
}
