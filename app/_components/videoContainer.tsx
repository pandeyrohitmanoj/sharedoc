'use client'
import React, { useRef, useEffect, useState } from 'react';

interface VideoContainerProps {
  file: string,
  setCounter: React.Dispatch<React.SetStateAction<number>>,
}

  const VideoContainer: React.FC<VideoContainerProps> = ({ file, setCounter,  }) => {
    
    const  [play,setPlay ] = useState<boolean>(false)
    const videoRef = useRef<HTMLVideoElement>(null);
const sourceRef = useRef<HTMLSourceElement | null>(null)
const handlePlay = () =>{

  if (videoRef.current) {
    videoRef.current.play()
    //console.log('some');
  }
}
  // useEffect(() => {
  //   if (videoRef.current && sourceRef.current  && file) {
  //   if(play()){
  //     videoRef.current.play()
  //   }}
  // }, [play])
  useEffect(() => {
    if (videoRef.current && sourceRef.current  && file) {
      videoRef.current.src = file
      sourceRef.current.type = 'video/mov'
      //console.log(play);
      // videoRef.current.currentTime = currentTime;
      
    }
  }, [file,play]);
  const handleEnding = () => {
    //console.log('ended');
    setCounter(prev => prev+1)
  }
  return (
    <div className='relative'>
      <video className='bg-white' onClick ={handlePlay} height={500} width={500} ref={videoRef} onEnded={handleEnding} >
        <source ref={sourceRef} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoContainer;
