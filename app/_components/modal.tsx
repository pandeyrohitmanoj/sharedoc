type tModalProps = {
    children: React.ReactNode
}
export default function modal({ children }: tModalProps) {
  //console.log('modal');
  return (    
    <section className="absolute w-screen h-screen flex justify-center items-center bg-transparent flex-col">
        {children}
    </section>
  )
}
