'use client'

import { createContext, useContext, } from 'react'
// import { userSignalState, insertFileInSignal, setSignal, tUseSignal, stringifiedSignal, tStringifiedSignal, selectedvideoIndex, tSelectedVideoIndex} from './signal'

import {
	signal,
	computed,
	batch,
	effect,
	Signal,
	type ReadonlySignal,
	untracked,
} from "@preact/signals-core";
import type { ReactElement } from "react";
import {
	useSignal,
	useComputed,
	useSignalEffect,
} from "@preact/signals-react/runtime";

export {
	signal,
	computed,
	batch,
	effect,
	Signal,
	type ReadonlySignal,
	useSignal,
	useComputed,
	useSignalEffect,
	untracked,
};

// declare module "@preact/signals-core" {
// 	// @ts-ignore internal Signal is viewed as function
// 	// eslint-disable-next-line @typescript-eslint/no-empty-interface
// 	interface Signal extends ReactElement {}
// }
// import {
//   signal,
//   Signal,
//   ReadonlySignal,
//   computed,
// } from "@preact/signals-react";
import {
  tProfileDb,
  fileData,
  tFriend,
} from "@/app/profilesDb/profile.schema";

export type tUseSignal = Signal<tProfileDb>;
export type tUserSignalValue = ReadonlySignal<tProfileDb>;

// const user = 
export const initialState: tProfileDb =  {
  userIndex: '',
  username: '',
  userImage: '',
  email: '',
  password: '',
  storageUsed: 0,
  listOfFiles: [],
  friends: [],
  sharedFiles: []
}

// //console.log(initialState);
// if(!initialState){
//   throw new Error("No user found");
// }
export const userSignalState = signal<tProfileDb>(initialState);
export const userSignalStateValue = () => computed( () => userSignalState.value )
export const freindsSignalStateValue: ReadonlySignal<tFriend[]> =  computed( () => userSignalState.value.friends ?? [] ) 
export type tSelectedVideoIndex = Signal<number> 

export const selectedvideoIndex: tSelectedVideoIndex = signal(-1)
export const videoTop = signal<number>(0)
export const setSignal = (signalValue: tProfileDb) => {
  // //console.log(signalValue);
  userSignalState.value = signalValue;
};
export type tStringifiedSignal = ReadonlySignal<string> 

export const stringifiedSignal: tStringifiedSignal = computed( () => {
  const stringifiedValue = JSON.stringify(userSignalState.value)
  return stringifiedValue
})

export const insertFileInSignal = ( value: fileData | fileData[], storage?: string ) => {
  const newSignal  = userSignalState.value
  const insertValue: fileData[] = Array.isArray(value) ? [...userSignalState.value.listOfFiles, ...value] : [...userSignalState.value.listOfFiles,value]
  newSignal.listOfFiles = insertValue
  if(storage) {
    newSignal.storageUsed = Number(storage)
  }
  //console.log(newSignal);
  userSignalState.value = newSignal
}
type contextType = {
    userSignalState: tUseSignal, 
    selectedvideoIndex: tSelectedVideoIndex,
    stringifiedSignal: tStringifiedSignal,
    setSignal: Function,
    insertFileInSignal: Function,
    computeSignal: ReadonlySignal<string>,
    someSignal: tSomeSignal,
    videoTop: Signal<number>,
}
const ThemeContext = createContext<contextType | undefined>(undefined)


type tSomeSignal = Signal<{ time: number}>
export const someSignal: tSomeSignal = signal({time: Date.now()})
export const computeSignal = computed( () => JSON.stringify(someSignal))
type Tcomponent = {children: React.ReactNode}

export const contextValue = { 
    userSignalState,
    selectedvideoIndex,
    stringifiedSignal,
    setSignal,
    insertFileInSignal,
    someSignal,
    computeSignal,
    videoTop
}
export const MyContext: React.FC<Tcomponent> = ({ children } ) => {
    return (
      <ThemeContext.Provider value={ contextValue}>
        {children}
      </ThemeContext.Provider>
    );
  };
export const useAuth = () => {
  const context = useContext(ThemeContext)
  if(!context) {
    throw new Error(`context is null`)
  }
  return context
}

  export default MyContext