
import { Roboto_Serif, Sigmar_One, } from 'next/font/google'
import Image from 'next/image'
const sigmarFont = Sigmar_One({
    subsets: ['latin'],
    weight: ['400']
  })
  const robotoMon = Roboto_Serif({
    subsets: ['latin'],
    weight: ['300']

  })
  type tProps ={
    userName: string,
    // userImage: string,
    storageUsed: number
  }
export default function navigationTop({ userName, storageUsed}: tProps) {
  return (
    <nav className='sticky inset-x-0 top-0 h-max bg-gray-800  pl-4 py-3 z-20'>
        <ul className="list-none h-full w-full flex sm:gap-1 lg:gap-3  text-2xl  justify-around items-center flex-wrap">
            <li className={`text-white hover:text-blue-500 hidden sm:inline lg:text-xl capitalize ${sigmarFont.className}`}>{userName.substring(0,19)}</li>
            <li className={`${sigmarFont.className} drop-shadow-lg sm:text-4xl lg:text-4xl capitalize text-blue-500 `}>Share Doc</li>
            <li className={`${sigmarFont.className} drop-shadow-lg capitalize text-white text-xs sm:text-lg`}>{String(storageUsed).substring(0,4)}/3 GB</li>
        </ul>
    </nav>
  )
}
