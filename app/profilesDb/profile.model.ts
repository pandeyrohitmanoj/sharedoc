
import { v4 as uuidv4 } from 'uuid'

import db from '../db'
import { accoutType, fileData, fileDescription, tProfileDb } from './profile.schema'

export function getUser(userValue: string, userField?: string) {
    const field = userField ?? 'userIndex'
    return db.find( user => user[field] == userValue ) ?? db[0]
}

export function createUser( username: string, email: string, password: string, userImage: string, accountDetails: accoutType ) {
    try {
        const possibleUser = getUser(email, 'email')
        if( !possibleUser )  {
            throw new Error("No user found")            
        }
        const userIndex = uuidv4()
        const storageUsed = accountDetails.storageAlloted
        const user: tProfileDb = {
            username,
            userIndex,
            userImage, 
            email: '',
            password, 
            storageUsed,
            listOfFiles: [],
        }
        db.push(user)
        return { ok: true, message: 'user created'}
    }
    catch( error: Error | any ) {
        console.error("error at creating user")
        return { ok: false, message:'"error at creating user"'}
    }
}

export function addFileToUser(userIndex: string,fileLink: string,fileDescription: fileDescription, fileIndex: number) {
    try {
        const user = db.find( user => userIndex== user.userIndex )
        if(!user) {
            throw new Error("No user exist");
            
        }
        const file: fileData = {
            fileIndex,
            fileLink,
            fileDescription,
        }
        user.listOfFiles.push(file)
        return { ok: true, message: 'fileuploaded'}
    } catch( error: Error | any) {
        const errormessage = `Error at addFileToUser: ${error}`
        console.error(errormessage)
        return { ok: false, message: errormessage}
 
    }

}