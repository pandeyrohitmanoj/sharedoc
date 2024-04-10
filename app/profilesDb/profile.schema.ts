export type tProfileDb = {
    userIndex: string,
    username: string,
    email:string,
    userImage: string,
    password: string,
    storageUsed: number,
    listOfFiles: fileData[],
    friends?: tFriend[],
    notification?: tFriend[],
    sharedFiles: tSharedFile[],
}
export type tSharedFile = {
    userName: string,
    userImage: string,
    listOfFiles: fileData[],
  }
type tNotification ={
    sender: tFriend,
    receiver: tFriend,
}
export type tFriend = {
    username: string,
    userIndex: string,
    userImage: string,
}
const priviledgedOptions = [ 'compression', 'translation']

type tPriviledgedOptions = typeof priviledgedOptions[number]

type tSubArray = tPriviledgedOptions[]

export type accoutType = {
    storageAlloted: 3 | 5 | 10,
    type: 'premium' | 'standard',
    priviledgedOptions: tSubArray,
}

export type fileData = {
    fileIndex: number,
    fileLink: string,
    counter?: number,
    duration: number,
    fileDescription: fileDescription,
    viewers?: string[],
}

export type fileDescription = {
    thumbnail: string,
    transcript: string,
    viewers?: string[],
}

export type user = {
    username: string,
    userImage: string,
    userIndex: string,
}