'use client'

import { useCallback, useEffect, useMemo, useState } from "react"
import VideoContainer from "../../_components/videoContainer"
import { effect, signal, useComputed } from "@preact/signals-react"
import LineComponent from "@/app/_components/lineComponent"
// const videoSignal = signal<Record<string,File> | null>(null)
const videoLink = `${backend}/getVideo`


const currentVideo = signal<number>(-1)

type tParams = {
    params: {
        paramsArray: string[]
    }
}
let interval: NodeJS.Timeout;
const intervalValue = ()  =>{ 
    interval =  setInterval(() => {
    currentLine.value+=1
}, 1000) }

async function fetchBackend(link: string) {
    const result = fetch(link,{method: 'GET'}).then( async res => {
        if (!res.ok) {
        throw new Error('Failed to fetch video');
      }
        const videoBlob = await res.blob();
        //console.log(videoBlob.size);
        const url = URL.createObjectURL(videoBlob);
        return url }).catch(err => {
            throw new Error(`Error at fetchBackend`)
        })
        return result
}
export default function video({params: {paramsArray}}: tParams) {
    const [video,setVideo] = useState<Record<string,string> | null>(null)
    const [ counter, setCounter] = useState<number>(-1)

    if(paramsArray.length!==3) {
        throw new Error(`Bad request`)
    }
    const videoName = paramsArray[0]
    let counterMax: number | string = paramsArray[1]
    let duration: number | string  = paramsArray[2]
    counterMax = Number(counterMax)
    duration = Math.floor(Number(duration))
    
    if (isNaN(counterMax) || isNaN(duration) || videoName.length<10) {
        throw new Error(`bad request`)
    }
    const durationInSeconds = () => {
        if( typeof duration !== 'number') {
            throw new Error
            (`UI Error`)
        }
        const totalSeconds = duration
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);
      
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
      
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
    const oneVideoLength = duration/counterMax
    const getVideo = async () => {
    if( typeof counterMax =='number' && counter > counterMax ) {
            throw new Error('bad request')
        }
            let signalValue = video
            if( !signalValue ) {
                signalValue = {}
            }
            if( signalValue.hasOwnProperty(counter) ) {
                return
            }
            const link = `${videoLink}?videoName=${videoName}_${counter}.mp4`
            //console.log(link);
            const url = await fetchBackend(link)
                // const url = URL.createObjectURL(videoBlob);
                
                // setVideo(url);
                if( !signalValue ) {
                    signalValue = {}
                }
                signalValue[counter] = url
                setVideo(signalValue)
                intervalValue()
                setCounter(prev => prev+1)
                //console.log(counter);
    }

    useEffect(() => {
        getVideo()
    },[])
    const currentWidth = useComputed(() =>{
        const currentLineValue = currentLine.value
        if( typeof duration == 'string') {
            throw new Error(`UI Issue in currentwidth`)
        }
        if(currentLineValue>=duration) {
             
            clearInterval(interval)
            return 0
        }
        const ifGetVideo = 5 === currentLineValue%oneVideoLength

        if( ifGetVideo ) {
            //console.log(currentLineValue);
            getVideo()
        }
        const result = Math.floor( currentLine.value*100/duration)
        // //console.log(result);
        return result
    })
    const [ play, setPlay] = useState<boolean>(true)
    // useEffect(() => {
    // interval()
    // },play)
    useSignals()
  return (
    <div>
        { video && <VideoContainer file={video[counter-1]} setCounter={setCounter}/>}
        {/* <button className="block" onClick={() => { getVideo()}} >next video</button> */}
        <div className="h-8 w-full flex justify-center gap-2 items-center grow">
            <Image className="h-auto " height={0} width={0} alt='play'  src={Play} />
            <div className="">{currentLine.value}</div>
            <div className="w-full relative">    
        
            <div className="absolute z-1 h-1 rounded-lg bg-slate-700 w-full"></div>
            <div className="absolute z-2 h-1 rounded-lg bg-slate-400 w-4/6"></div>
            <div className="absolute z-3 h-1 rounded-lg bg-red-500" style ={{width: currentWidth.value}} ></div>
            </div>
            <div className="">{durationInSeconds()}</div>
        </div>
    </div>
  )
}
import Image from 'next/image';
import Play from '../../../public/play.svg'
import { useSignals } from "@preact/signals-react/runtime"
import { backend } from "@/app/_components/environmentVariable"

const currentLine = signal<number>(0)
