'use client'
import { signal } from "@preact/signals-react";
import { backend } from "./environmentVariable";
const linkSignal = signal<HTMLAnchorElement[]>([])


export async function handleDownload(fileLink:string) {
    try {
    //   loading.value=true
      const response = await fetch(`${backend}/getFile?fileName=${fileLink}`,{ method: 'GET'});
      const blob = await response.blob();
      //console.log(blob.size);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileLink);
      document.body.appendChild(link);
      link.click();
      linkSignal.value = [...linkSignal.value,link]
    //   loading.value = false
    //   document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }