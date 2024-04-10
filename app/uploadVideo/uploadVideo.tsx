'use client'
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import { fileData, fileDescription, user } from '../profilesDb/profile.schema';
// import { initialState, insertFileInSignal, userSignalState } from '../_utils/signal';
import { signal } from '@preact/signals-react';
import { contextValue, } from '../_utils/context';
import { getLocalStorageItem, logout } from '../_utils/localstorage';
import { useRouter } from 'next/navigation';

import Loading from '../_components/loading';
import { backend } from '../_components/environmentVariable';
const isLoading = signal<boolean>(false)
const languagesCode = {
  'default': 'default',
  'Hindi': 'hi',
  'English': 'en',
  'Spanish': 'es',
  'Marathi': 'mr',
  'Tamil': 'ta',
  'Telugu': 'te',
}

type FormData = {
  videoFile: File | null ,
  thumbnailFile: File | null,
  languageCode: string,
  transcript: string,
}
type tErrorData = {
  videoFile: string,
  thumbnailFile: string,
  languageCode: string,
  transcript: string,
}
const initialFormState = {
  videoFile: null,
  thumbnailFile: null,
  languageCode: '',
  transcript: ''
}
const initialErrorState = {
  videoFile: '',
  thumbnailFile: '',
  languageCode: '',
  transcript: ''
}
const FormComponent: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errorData, setErrorData] = useState<tErrorData>(initialErrorState)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)

  const { insertFileInSignal, userSignalState, videoTop  } = contextValue //useAuth()
  const [error, setError] = useState<string>('');
//console.log(userSignalState.value.userIndex);
  // Function to handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: keyof FormData) => {
    //console.log(event.target.className);
    if (event.target.files) {
      setFormData({ ...formData, [field]: event.target.files[0] });
    }
    //console.log(`field: ${field}`);
    isTranscriptEnabled()
  };
  const router = useRouter()
  
  // useEffect( () => {
  //   try {
      
  //   const data = getLocalStorageItem()
  //   const signalValues= Object.values(data)
  //   const length = signalValues.length
  //   //console.log(data);
  //   if(length<6) {
  //     //console.log(`length: ${length}`);
  //     logout()
  //     router.push('login')
  //   }else if( length>=6){
  //     data.listOfFiles = []
  //     //console.log(data);
  //     // const index = data.userIndex
  //   }
      
  //   } catch (error: Error | any ) {
  //     console.error(error)
  //     throw new Error(`User is doing somethignsuspicious: ${error.message}`)
  //   }
  // }, [])
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if(!inputRef.current  || !textRef.current || !thumnailRef.current ) {
      throw new Error('Error on client side')
    }
    const { videoFile , thumbnailFile, languageCode , transcript} = formData
    const entries = Object.entries(formData)
    
    if(!videoFile){
      //console.log(`no video selected`);
      setErrorData( error => ({ ...error, videoFile:'no video selected' }))
      return
    }
    isLoading.value = true
    setIsDisabled(true)
    const form = new FormData()
    form.append('userIndex',userSignalState.value.userIndex)
    if(!userSignalState.value.userIndex){
      //console.log(`cant do it`);
      return
    }
    form.append('files', videoFile)
    form.append('languageCode','en')
    form.append('transcript',transcript ?? '')
    form.append('fileIndex',(videoTop.value+1).toString())
    form.append('storage',String(userSignalState.value.storageUsed))
    let isThumbnailExist = false
    if(!thumbnailFile) {
      //console.log('no thumbnail selected' );
      setErrorData( error => ({ ...error, thumbnailFile:'no thumbnail selected' }))
    }else{
      form.append('files',thumbnailFile)
      isThumbnailExist = true
    }
    try{
    const result = await axios.post(`${backend}/${ !isThumbnailExist ? 'uploadFileToCloud' : 'uploadFileToCloudAndGetTranscription'}`,form
      ,{ headers: {
        'Content-Type': 'multipart/form-data',
      }
    }
    )
    const data = await result.data

    if(!data.ok) {
      throw new Error(`backend error, please try agian later: ${data.message}`)      
    }
    const { transcription, cloudUrl, thumbnail, counter, duration, storage} = data

    // const transcript
    /*{cloudUrl: 'https://storage.googleapis.com/share_doc/b3196c89-2538-47e2-ac22-fcaed9fbd868test.mp4', thumbnail: 'https://storage.googleapis.com/share_doc/b3196c89-2538-47e2-ac22-fcaed9fbd868image.jpg', transcription: 'हाय लेकिन ईसीएस बलबीर कितना यूआईडीएआई अपलोडेड ट्रांसक्रिप्ट', ok: true} */
    setFormData(state => ({...state, transcript: transcription, }))
    //console.log(data);
    const fdescription: fileDescription = {
      thumbnail,
      transcript,      
    }
    const fileUpload: fileData = {
      fileIndex: videoTop.value,
      fileLink: cloudUrl,
      fileDescription: fdescription,
      counter,
      duration,
    }
    insertFileInSignal(fileUpload,storage)

    videoTop.value+=1
    inputRef.current.value = ''
    textRef.current.value = ''
    thumnailRef.current.value = ''
    // setFormData(initialFormState);
    // setErrorData(initialErrorState)
    // setIsDisabled(false)

    isLoading.value = false
    setIsDisabled(false)

    } catch (error) {
      console.error('Error fetching uploadedBy:', error);
      setError('Error fetching uploadedBy');
      return;
    }
  }
  

  // const handleDropboxChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const value = event.target.value
  //   //console.log(value);
  //   setFormData(state => ({...state, languageCode:value}))
  //   isTranscriptEnabled()
  // }
  const isTranscriptEnabled = () => {
    const isFileSlected  = formData.videoFile
    //console.log('isFileSlected',!isFileSlected);
    let isLanguageSelected 
    if( formData.languageCode) {
      isLanguageSelected = formData.languageCode === 'default'
    }
    //console.log('isLanguageSelected', formData.languageCode);
    const result = !isFileSlected
    //console.log(`result: ${formData.languageCode}`);
    // if(!result)
    setIsDisabled(result)
  }
  const inputRef = useRef<HTMLInputElement>(null)
  // const selectRef = useRef<HTMLSelectElement>(null)
  const thumnailRef = useRef<HTMLInputElement>(null)
  const textRef = useRef<HTMLTextAreaElement>(null)

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 rounded shadow-md">

      <div className="mb-4">
        <label htmlFor="videoFile" className="block">Select Video:</label>
        <input ref={ inputRef} type="file" id="videoFile" onChange={(e) => handleFileChange(e, 'videoFile')} className="mt-1 w-full" />
      </div>
      { errorData.videoFile && <div className='text-red'>{errorData.videoFile}</div>}
      {/* <div className="mb-4">
          <label htmlFor="languageCode" className="block">Select Language used in video to generate transcription:</label>
        <select ref={selectRef} defaultValue={'default'} name='languageCode'  onChange={handleDropboxChange}>
          { Object.entries(languagesCode).map( ( language: string[], index: number) => {
            // //console.log(language);
            return <option key={index} value={language[1]} disabled={index==0} >{language[0]}</option>
          })}
        </select> 
      </div>*/}
      { errorData.languageCode && <div className='text-red'>{errorData.languageCode}</div>}

      <div className="mb-4">
        <label htmlFor="thumbnailFile" className="block">Select Thumbnail:</label>
        <input ref={thumnailRef} type="file" id="thumbnailFile" onChange={(e) => handleFileChange(e, 'thumbnailFile')} accept="image/*" className="mt-1 w-full" />
      </div>
      { errorData.thumbnailFile && <div className='text-red'>{errorData.thumbnailFile}</div>}
      <div className="mb-4">
        <label htmlFor="transcript" className="block">Description:</label>
        <textarea ref={textRef} id="transcript" value={formData.transcript} onChange={(e) => setFormData(state => ({ ...state, transcript: e.target.value }))} className="mt-1 w-full h-24"></textarea>
      </div>

      <div className="mb-4">
        { isDisabled ? <button className='px-4 py-2 mr-4 rounded-lg uppercase font-bold bg-blue-400 text-white self-end' disabled>Upload File</button> : <button className='px-4 py-2 mr-4 rounded-lg uppercase font-bold bg-blue-500 text-white self-end' type='submit'>Upload File</button>}
      {isLoading.value? <Loading/> : null}

      </div>

      {/* <div className='w-64'>signal: {JSON.stringify(userSignalState)}</div> */}
    </form>

  );
};
export default FormComponent;
