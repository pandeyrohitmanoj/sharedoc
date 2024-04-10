'use client'
import { useEffect } from "react"
// import { useAuth } from "../_utils/context"
import dynamic from "next/dynamic"
// import {  someSignal, computeSignal } from './same'
import { userSignalState, } from "../_utils/context"
const updaeSignal = (a: number) => {
    //console.log('s');
    userSignalState.value.storageUsed = a
}
const Home = () => {
    // const { userSignalState} = useAuth()
    updaeSignal(Date.now())
    
    return <div>{userSignalState.value.storageUsed}</div>
} 
export default Home