
export default function SearchContainer({ username,userIndex }:{image:string,userIndex: string, username: string}) {
    return <div className=' bg-black w-16' data-id={userIndex} key={userIndex} >{username}</div>
}