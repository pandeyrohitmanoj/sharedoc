import { tProfileDb } from "../profilesDb/profile.schema"
import { initialState, userSignalState,} from "./context"


export const getLocalStorageItem = ( ) => {
        if(userSignalState.value.userIndex) return userSignalState.value
        const statevalue: tProfileDb = initialState
        //console.log(initialState);
        const keys: string[] = Object.keys(statevalue)
        for(let i=0; i < keys.length ; i++ ){
            const key = keys[i]
            
            let data = localStorage.getItem(key) 
            //console.log(key,data);
            if(!data) {
                delete statevalue[key]
                continue
            }   
            statevalue[key] = data
        }
        //console.log(statevalue);
        return statevalue
    }
    

 export const setLocalStorageItem = ( userObject: tProfileDb ) => {
        const keys = Object.keys(userObject)
        for(let i=0; i<keys.length ; i++ ) {
            const key = keys[i]
            const value = userObject[key]
            //console.log(`${key}: ${value}`);
            if(typeof value == 'string'){
                localStorage.setItem( key, value )
            }
            else if(typeof value == 'number') {
                localStorage.setItem( key, String(value) )
            }else continue
        }
    }
   
 export const removeLocalStorageItem = ( arrayOfItems: string[] ) => {
        for(let i=0; i<arrayOfItems.length ; i++ ) {
            const key = arrayOfItems[i]
            localStorage.removeItem(key)
            delete userSignalState.value[key] 
        }
    }
    
 export const logout = () => {
        localStorage.clear()
        userSignalState.value = initialState
    }
