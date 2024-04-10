import FriendComponent from './friendComponent'
import { tFriend } from '../profilesDb/profile.schema'
type tFriends = { friendsArray: tFriend[]}


export default function freinds({ friendsArray, }: tFriends) {
  
  return (
    <div className='flex flex-col pl-4 h-96 overflow-y-auto w-96  mt-10 bg-slate-900'>
      <div className='max-w-max'>
        <div className=''>Names:</div>
        { friendsArray && friendsArray.map( ( friend, index ) => {
          return <FriendComponent key={index} name={friend.username} />
        })}
      </div>
    </div>
  )
}
