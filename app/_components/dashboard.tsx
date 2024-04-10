import React from 'react'
import Image from 'next/image'
type tDashboard = {
  username: string,
  storageUsed: number,
  image: string,
}
export default function dashboard({ username, storageUsed, image }: tDashboard) {
  
  return (
    <section className='flex justify-around items-center flex-wrap ' title="dashboard">
      <h1 title='username'>{username}</h1>
      <h3 title='used storage value'>{storageUsed}</h3>
      <Image src={image} alt='user dp' width={50} height={50} className='rounded-full  w-16 h-16' priority={true}/>
    </section>
  )
}
