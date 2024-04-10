import React from 'react'

type tFriendComponent = { name: string, }
export default function freindComponent({ name, }: tFriendComponent) {
  return (
    <div>{name}</div>
  )
}
