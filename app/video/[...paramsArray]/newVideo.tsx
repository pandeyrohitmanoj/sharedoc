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
const counter = signal<number>(-1)
const videoSignal = signal<Record<number,string>>({})
function fetchBackend(link: string, previousBlobURL ?: string): Promise<string> {
    return new Promise( (resolve,rej) => {
        fetch(link,{method: 'GET'}).then( async res => {
        if (!res.ok) {
            rej('Failed to fetch video');
        }
        const videoBlob = await res.blob();
        //console.log(videoBlob.size);
        const url = URL.createObjectURL(videoBlob);
        //console.log('filedoenloaded',counter.value);
        resolve(url)
    }).catch(err => {
            throw new Error(`Error at fetchBackend`)
        })
    
    })
}
const currentTime = signal<number>(0)
let videoName:string
let counterMax: number
let duration: number
let interval: number
effect(() => {
    if(duration)
    //console.log(duration%counter.value);
    
    if(counter.value == -1 ){
        
        if(currentTime.value==2){
            counter.value +=1
            const link = `${videoLink}?videoName=${videoName}_${counter.value}.mp4`
            fetchBackend(link).then(res => {
                const dummySignal: Record<number,string> = {}
                dummySignal[counter.value] =res
                videoSignal.value = dummySignal
                setInterval(()=>{
                    currentTime.value +=1
                },2000)
            }).catch( err => {
                console.error(`error at fethcbackend: ${err}`)
                throw new Error(`error at fethcbackend: ${err}`)
            }) 
        }
    }else if(interval/2==duration%counter.value){
        counter.value +=1
        const link = `${videoLink}?videoName=${videoName}_${counter.value}.mp4`
        fetchBackend(link).then(res => {
            const dummySignal: Record<number,string> = {}
            dummySignal[counter.value] =res
            videoSignal.value = dummySignal
            setInterval(()=>{
                currentTime.value +=1
            },2000)
        }).catch( err => {
            console.error(`error at fethcbackend: ${err}`)
            throw new Error(`error at fethcbackend: ${err}`)
        }) 

    }
})
const play = signal<boolean>(false)
export default function Video({params: {paramsArray}}: tParams) {
    
    useEffect(() => {
        if(paramsArray.length!==3) {
            throw new Error(`Bad request`)
        }
        videoName = paramsArray[0]
        counterMax  = Number(paramsArray[1])
        duration   = Number(paramsArray[2])
        interval = Math.floor((duration-10)/counterMax)
        //console.log(interval);

        if (isNaN(counterMax) || isNaN(duration) || videoName.length<10) {
            throw new Error(`bad request`)
        }
        const link = `${videoLink}?videoName=${videoName}_${counter.value}.mp4`
        if(!videoSignal.value[-1]){
            fetchBackend(link).then(res => {
                const dummySignal: Record<number,string> = {}
                dummySignal[-1] =res
                videoSignal.value = dummySignal
                if(!videoRef.current) throw new Error(`Problem with videoRef`)
                videoRef.current.src = res
                videoRef.current.play()
                setInterval(()=>{
                    currentTime.value +=1
                },2000)
            }).catch( err => {
                console.error(`error at fethcbackend: ${err}`)
                throw new Error(`error at fethcbackend: ${err}`)
            }) 
        }
    }, [])
    const videoRef = useRef<HTMLVideoElement>(null);
    const sourceRef = useRef<HTMLSourceElement | null>(null)
    useEffect(() => {
        if (videoRef.current) {
        if(!play) {
            videoRef.current.play()
            //console.log('play');
            return
        }
        videoRef.current.pause()
    }}, [play])
    const handlePlay = () =>{
        play.value= !play
      }
      const handleEnding = () => {
        //console.log('ended');
        //console.log(counter.value);
        const counterValue: number = counter.value
        //console.log(videoSignal.value[counterValue]);
        if(!videoRef.current) throw new Error(`Problem with videoRef`)
        videoRef.current.src = videoSignal.value[counterValue]
        counter.value +=1
      }
      useSignals()
    return (
        <div>
        <video controls className='bg-white' onClick ={handlePlay} height={500} width={500} ref={videoRef} onEnded={handleEnding} >
        <source ref={sourceRef} />
        Your browser does not support the video tag.
      </video>

      {currentTime.value}
      </div>
    )
}