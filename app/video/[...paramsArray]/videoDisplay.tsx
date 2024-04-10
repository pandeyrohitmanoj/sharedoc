'use client'
import React, { useEffect, useRef } from 'react'
import { effect, signal, useSignal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import { backend } from '@/app/_components/environmentVariable';
type tParams = {
    params: {
        paramsArray: string[]
    }
};

const videoLink = `${backend}/getVideo`
function fetchBackend(link: string, previousBlobURL ?: string): Promise<string> {
    return new Promise( (resolve,rej) => {
        fetch(link,{method: 'GET'}).then( async result => {
            const res = await result.json()
        if (!res.ok) {
            rej('Failed to fetch video');
        }
        //console.log(res);
        resolve(res.url)
    }).catch(err => {
            throw new Error(`Error at fetchBackend`)
        })
    
    })
}
let videoName:string
let counterMax: number
let duration: number
let interval: number
export default function videoDisplay({params: {paramsArray}}: tParams) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const sourceRef = useRef<HTMLSourceElement | null>(null)
    useEffect(() => {
    if(paramsArray.length!==3) {
        throw new Error(`Bad request`)
    }
    videoName = paramsArray[0]
    counterMax  = Number(paramsArray[1])
    duration   = Number(paramsArray[2])
    interval = Math.floor((duration-10)/counterMax)
    //console.log(interval);

    if (isNaN(counterMax) || isNaN(duration)){//} || videoName.length<10) {
        throw new Error(`bad request`)
    }
    const link = `${videoLink}?videoName=${videoName}.mp4&duration=${duration}`
    //console.log(link);
    fetchBackend(link).then(res => {
        //console.log(res);
        if(!videoRef.current) throw new Error(`Problem with videoRef`)
        videoRef.current.src = res
    }).catch( err => {
        console.error(`error at fethcbackend: ${err}`)
        throw new Error(`error at fethcbackend: ${err}`)
    }) 
}, [])
  return (
    <div>
        <video controls className='bg-white' height={500} width={500} ref={videoRef}>
            <source ref={sourceRef} />
            Your browser does not support the video tag.
        </video>
    </div>
  )
}
