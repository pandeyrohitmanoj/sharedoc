import React from 'react'
import { fileData } from '../profilesDb/profile.schema'
type tProps ={ userImage: string, userName:string, listOfFiles: fileData[],} 
import SharedCard from './sharedCard'
export default function sharedCardList({ userImage, userName, listOfFiles}: tProps ) {
  return (
    <div className='flex gap-4 max-w-max'>
    {listOfFiles.map( (file, index) => {
        return <SharedCard key={index} thumbnail={file.fileDescription.thumbnail} fileLink={file.fileLink} userImage={userImage} userName={userName} transcript={file.fileDescription.transcript} />
    })}</div>
  )
}
