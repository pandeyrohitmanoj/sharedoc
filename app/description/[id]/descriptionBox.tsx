'use client'
import { fileData } from "@/app/profilesDb/profile.schema"
// import { useAuth } from "../../_utils/context"
import { arrayComponentProps } from "@/app/_components/arrayData"

import { contextValue, } from '../../_utils/context'
const { userSignalState, } = contextValue
export default function Description({ params, }: {params: {id: string}}) {
  const { userSignalState} = contextValue
  const index = params.id 
  
  if( Number.isNaN(index) ) {
    throw new Error(`Not a number`)
  }
  const id = parseInt(index)
  if( !userSignalState.value.listOfFiles ) throw new Error(`no element selected`)
  const { fileLink, fileDescription: { thumbnail, transcript }}: fileData = userSignalState.value.listOfFiles[id] 
  return (
    <div className="w-screen px-8 py-24">
      <video height='350' width='100%' controls>
        <source src={fileLink} />
      </video>
        {/* <div>{title}</div> */}
        transcript:
        <div>{transcript}</div>
    </div>
  )
}