'use client'

import { effect, setSignal, userSignalStateValue } from '../_utils/context'

import SharedCardList from '../_components/sharedCardList'
import Notification from '../_components/notification'
import { Playpen_Sans } from 'next/font/google'
  import SearchFilter from '../_components/searchFilter'
import UploadVideo from '../uploadVideo/page'
import Link from 'next/link'
import { useSignal } from '@preact/signals-react'
import Friends from '../_components/friends'
import React, { useState, useEffect,} from 'react'
import { useRouter } from 'next/navigation'
import { computed, contextValue, freindsSignalStateValue, signal, userSignalState, } from '../_utils/context'
import { getLocalStorageItem, logout } from '../_utils/localstorage'
import { fileData, tFriend, tProfileDb } from '../profilesDb/profile.schema'

import NavigationBottom from '../_components/navigationBottom'
import NavigationTop from '../_components/navigationTop'
import CardList from '../_components/cardList'
import { useSignals } from '@preact/signals-react/runtime'
import { backend } from '../_components/environmentVariable'

type tlayout = {
    children: React.ReactNode,
}


const selectSignal = signal<string>('files')

export type tData = {
  userIndex:string,
  receiver: tFriend,
}

const playPenSan = Playpen_Sans({
  subsets:['latin'],
  weight: ['500'],
})

export default function layout() {
   const { selectedvideoIndex, insertFileInSignal, userSignalState, setSignal, videoTop, } = contextValue
   
  const router = useRouter() 
  const [state, setState] = useState<number>(0)
  
  useEffect( () => {
    try {   
      //console.log(userSignalState.value);
      
       
    const fetchUserfiles = async (userIndex:string) => {
      const fetchValue = await fetch(`${backend}/getFiles?index=${userIndex}`,{
        method:"GET",        
      })

      const response = await fetchValue.json()
      if(!response.ok) {
        logout()
        //console.log(`message: ${response.message}`);
        router.push('login')
        return
      }
      
      //console.log('files');
      const { files, friends, sharedFiles, storageUsed } = response
      // //console.log(listofFiles);
      // const filesValue : fileData[] = files
      // const friendsValue: tFriend[] = friends
      
      // const signalValue: tProfileDb = { ...userSignalState, listOfFiles: files, }
      // setSignal(signalValue)
      
      const currentVideoIndexTop = files.reduce( ( cumulator: number, file: fileData): number => Math.max(file.fileIndex, cumulator), 0) 
      videoTop.value = currentVideoIndexTop
      // insertFileInSignal(files)
      //console.log(`storageUsed:${storageUsed}`);
      const newSignal: tProfileDb = {...userSignalState.value,friends: friends, listOfFiles: files, sharedFiles, storageUsed: storageUsed }
      setSignal(newSignal)
      //console.log(newSignal);
    }
    //console.log('called');
    const data = getLocalStorageItem()
    //console.log(data);

    const signalValues= Object.values(data)
    const length = signalValues.length
    //console.log(length);    
    // if(!userSignalState.value.userIndex) {
    //   //console.log(userSignalState.value.userIndex.length);
    //   return
    // }
    if(length<6) {
      logout()
      router.push('login')
      //console.log(`length: ${length}`);
    }else if( length===6){
      data.listOfFiles = []
      
      //console.log(data);
      const index = data.userIndex
      fetchUserfiles(index)  
      // setState(state+1)
    }
    //console.log('something');
    return () => {
      // socketValue.disconnect()
    }
      
    } catch (error: Error | any ) {
      console.error(error)
      router.push('/login')
    }
  }, [])

  


  //console.log((userSignalState.value));

  useSignals()
  return (
    <main className=' '>
    { userSignalState.value.username && <NavigationTop userName={userSignalState.value.username} storageUsed={userSignalState.value.storageUsed}  /> }
    
    <div className='mt-4 px-4 pb-4 text-xl sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24'>
      <div className='flex flex-wrap text-xl gap-4 sm:gap-8 *:no-underline hover:cursor-pointer capitalize' style={{borderBottom:'2px solid white'}}>
        <div className='hover:text-blue-500' onClick={() => selectSignal.value='files'}>Files</div>
        <div className='hover:text-blue-500' onClick={() => selectSignal.value='friends'}>friends</div>
        <div className='hover:text-blue-500' onClick={() => selectSignal.value='upload'}>Upload File</div>
      </div>
      {
      selectSignal.value=='files' ?
      <article className={`${playPenSan.className} text-lg  w-full`}>
        My Files:
      { userSignalState.value.listOfFiles.length>0 ? <CardList  userIndex={userSignalState.value.userIndex} files={userSignalState.value.listOfFiles} freinds={userSignalState.value.friends ?? []} /> 
      : <div onClick={() => selectSignal.value='upload'} className='py-24 w-3/6 max-w-60 min-w-32  my-8 text-7xl flex justify-center items-center rounded-lg bg-slate-700'>
        +
      </div>}
      Files Shared To Me:
      <div className='mt-10 flex justify-start w-full overflow-x-auto'>
        { userSignalState.value && userSignalState.value.sharedFiles && userSignalState.value.sharedFiles.length>0 && userSignalState.value.sharedFiles.map( (freind, index ) => {
          const { userImage, userName, listOfFiles} = freind
          //console.log(freind);
          // //console.log(userImage, userName, listOfFiles);
          return listOfFiles.length>0 ? <SharedCardList key={index} {...freind} /> : <div onClick={() => selectSignal.value='friends'} className='py-24 max-w-60 min-w-52  text-4xl flex justify-center items-center rounded-lg bg-slate-700'>
          +
        </div>
        })  }
      </div>
      </article> 
      :selectSignal.value=='friends' ?  <div className='relative pt-10'><SearchFilter/><Friends friendsArray={freindsSignalStateValue.value} /></div>      : <UploadVideo />
      }
    
    </div>
    <NavigationBottom />

  </main> 
  )
}
