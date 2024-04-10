import Image from 'next/image'
import { fileData } from '../profilesDb/profile.schema'
import { arrayComponentProps } from './arrayData'
import Link from 'next/link'

export default function arrayComponent( { index, fileLink, thumbnail,transcript, }: arrayComponentProps) {
  const link = `http://localhost:3000/description/${index}`
 
  return (
      <article className='w-48' >
        <a href={link}>
          <Image className='bg-cover w-full h-28 rounded-4' src={thumbnail} width='0' height='0' alt='image' />
        </a>
      </article>
  )
}
