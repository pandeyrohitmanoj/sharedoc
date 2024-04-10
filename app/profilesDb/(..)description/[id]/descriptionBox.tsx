'use client'
import { fileData } from "@/app/profilesDb/profile.schema"
import { contextValue, } from "../../../_utils/context"
import { arrayComponentProps } from "@/app/_components/arrayData"
import Modal from "@/app/_components/modal"
export default function Description({ params, }: {params: {id: string}}) {
  const { userSignalState} = contextValue //useAuth()
  const index = params.id 
  //console.log(`modal`);
  if( Number.isNaN(index) ) {
    throw new Error(`Not a number`)
  }
  const id = parseInt(index)
  if( !userSignalState.value.listOfFiles ) throw new Error(`no element selected`)
  const { fileLink, fileDescription: { thumbnail, title, transcript }}: fileData = userSignalState.value.listOfFiles[id] 
  return (
    <Modal>
      <video height='350' width='100%' controls>
        <source src={fileLink} /> 
      </video>
        <div>{title}</div>  
        transcript: 
        <div>{transcript}</div>
    </Modal>
  )
}