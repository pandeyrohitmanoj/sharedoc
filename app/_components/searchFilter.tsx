'use client'
import SearchIcon from '../../public/search.svg'
import Image from 'next/image'
import SearchContainer from './SearchContainer'
import { tFriend } from '../profilesDb/profile.schema'
import { useEffect } from 'react'
// import { tData } from '../firstPage/layout'


import { signal, } from '@preact/signals-react'
import { contextValue, userSignalState,  } from '../_utils/context'
import { useSignals } from '@preact/signals-react/runtime'
import { debounce } from './debounce'
// import { io, Socket, SocketOptions } from 'socket.io-client'

// const link = 'http://localhost:8000'

// export const socket = signal<Socket>(io(link))

import { backend } from './environmentVariable'

const searchValueSignal = signal<string>('')
const people  = signal<tFriend[]>([])
async function getUserNames(){
    try{

        const searchValue = searchValueSignal.value
        if(!searchValue) {
            people.value = []
            return
        }
        const fetchResult =  await fetch(`${backend}/getUsernames?username=${searchValue}`, {
            method:'get',
        })
        const result = await fetchResult.json()
        if(!result.ok) {
            throw new Error(`Server isnt responding well: ${result.message}`)
        }
        const selectedusers: tFriend[] = result.listOfUsername
        const users: tFriend[] = selectedusers.filter( freind => freind.userIndex !== userSignalState.value.userIndex)
        // clg
        people.value = users

    } catch( error: Error | any ) {
        throw new Error(`Had a issue in : ${error} `)
    }
}
const result = debounce(getUserNames, 800)

export default function searchFilter() {
    const { userSignalState, } = contextValue
    useSignals()
    // const socketValue = socket.value
    // const handleNotificationClick = (userIndex: string) => {
    //     const data = {
    //       userIndex,
    //       sender: {
    //         userIndex: userSignalState.value.userIndex,
    //         userImage: userSignalState.value.userImage,
    //         username: userSignalState.value.username,
    //       }
    //     }
    //     socketValue.emit('uploadNotification',data)
    //   }
    useEffect(() => {
        // if(userSignalState.value.userIndex)
        // socketValue.emit('start',userSignalState.value.userIndex)
        // socketValue.on('notification', (data: tData[]) => {
        //   //console.log(`socket: ${JSON.stringify(data)}`);
        //   // const newSignal = userSignalState.value
        //   // if( !newSignal.notification ) {
        //   //   newSignal.notification = []
        //   // }
        //   // const newNotifications:tFriend[] = [ ...newSignal.notification, data]
      
        //   // newSignal.notification = newNotifications
        //   // setSignal(newSignal) 
        // })

    }, [])
    const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
        
    try {
        const elemnt = e.target as HTMLDivElement
        const id = elemnt.getAttribute('data-id') as string
        const newSignal = {...userSignalState.value}   

        if( newSignal.friends == undefined ) {
            newSignal.friends = []
        }    
        let freinds = newSignal.friends
        const ifFriendExist = freinds.find(( friend ) =>  friend.userIndex==id )
        const freindsValue = people.value.find( person => person.userIndex==id)
        if(ifFriendExist) {
            searchValueSignal.value = ''
            people.value = []
            //console.log('some');
            return
        }
        // //console.log(id)
        if(!freindsValue) throw new Error( `Impossibe error`)
        const newFreind: tFriend = {...freindsValue}
        const newFreinds: tFriend[] = [...freinds, newFreind]

        // if( friend) {
        //     let newFreinds = [...freinds,]
        // }
        const fetchResult = await fetch(`${backend}/addFriend?recipientIndex=${newFreind.userIndex}&recipientImage=${newFreind.userImage}&recipientUsername=${newFreind.username}&recipient&userIndex=${userSignalState.value.userIndex}&userImage=${userSignalState.value.userImage}&username=${userSignalState.value.username}`,{ method:
     'get'})
     const result = await fetchResult.json()
     if(!result.ok) {
        throw new Error(`Error while adding a freind`)
     }
     people.value = []
     newSignal.friends = newFreinds
     userSignalState.value = newSignal
    } catch (error: Error | any) {
        const err = `Error at serchFilter in handleClick: ${error}`
        console.error(err)
        throw new Error(err)
    }
    }
    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const element = e.target as HTMLInputElement
        searchValueSignal.value = element.value as string
        result()
    }
    useSignals()
  return (
    <div className='absolute w-48 pl-10 py-6 gap-2 flex flex-col justify-start top-0 left-0 z-1'  >
        <div className='flex justify-center gap-2'><Image alt='search icon' src={SearchIcon} /><input type='text' onChange={changeHandler}/></div>
        <div className=''  onClick={handleClick}>
            {people.value.map((personName,index) => {
                return <SearchContainer key={index} image={personName.userImage} userIndex={personName.userIndex} username={personName.username} />
            })}
        </div>

        
    </div>
  )
}

