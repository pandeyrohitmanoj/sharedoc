'use client'

import { fileData, user } from '../profilesDb/profile.schema'
import ArrayComponent from './arrayComponent'
import { useRouter } from 'next/navigation'
import { contextValue, } from '../_utils/context'

export type arrayComponentProps = {
  fileLink: string,
  thumbnail:string, 
  transcript: string, 
  index: number,
}
export default function arrayData({listOfFiles}: {listOfFiles: fileData[]}) {
  const { selectedvideoIndex, } = contextValue
  const router = useRouter()
  const handleClick =  (event: React.MouseEvent<HTMLDivElement> ) => {
    const element = event.target as HTMLDivElement
    const index = element.className[0]
    selectedvideoIndex.value = parseInt(index)
    router.push('/description')
  }

  return (
    <div className='px-8 py-12 overflow-y-auto' onClick={handleClick}>
        {listOfFiles.map( ( file, index ) => {
          const { fileLink, fileDescription: { thumbnail,transcript, }, } = file
          const arrayProps: arrayComponentProps = { index, fileLink, thumbnail, transcript, }
          return <ArrayComponent key={index} {...arrayProps}/>
        })}
      </div>
  )
}

/*
<article className='w-48' key={index}>
            <Link href={`/description`}></Link>
            <Image className='bg-cover w-full h-28 rounded-4' src={file.fileDescription.thumbnail} width='0' height='0' alt={fileDescription.description} />
            <div className=''>{fileDescription.title}</div>
          </article> */