import React from 'react'
type tProp = {
    username: string,
    userIndex: string,
    userImage: string
}
export default function notification({username,userIndex,userImage}: tProp) {
  return (
    <div>
        <div>{username}</div>
        <div>{userImage}</div>
        <div>{userIndex}</div>
    </div>
  )
}
