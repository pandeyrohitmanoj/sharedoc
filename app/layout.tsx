import React from 'react'
import { Roboto } from "next/font/google";
import "./global.css";
import { Inter   } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap', adjustFontFallback: false})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400','700']
})


type tRootLayoutProp = {
    children: React.ReactNode;
  };

  export const metadata = {
    title: "ShareDoc",
    description: "File Sharing and storing web app",
    
  };
export default function layout({ children,}:tRootLayoutProp) {;
  return (
    <html lang="en" >
      <body className={` ${inter.className} ${roboto.className} relative min-w-64`}  suppressHydrationWarning={true}>  
      {children}    
    
       </body>
     </html>

  )
}
/*
{/* <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        { <link rel="preconnect" href="https://fonts.gstatic.com" /> }
        <link href="https://fonts.googleapis.com/css2?family=Playpen+Sans:wght@100..800&family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap" rel="stylesheet"/>
        <link href='https://fonts.googleapis.com/css2?family=Playpen+Sans:wght@100;400;800&display=swap'/>
      <link href="https://fonts.googleapis.com/css2?family=Playpen+Sans:wght@100..800&family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap" rel="stylesheet"/>
      </Head> }
      
      
      {/* <Head>
      {/* <link rel="manifest" href="/manifest.json" /> }
      <title>something</title>
      </Head> }*/