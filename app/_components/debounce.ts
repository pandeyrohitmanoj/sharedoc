
export const debounce = (cb: Function, d: number) => {
    let timer: NodeJS.Timeout
    return function(...args: any) {
        // //console.log(`delay: ${timer}`);
        const cbParameters = arguments
        //console.log(`arguments: ${args}, timeout: ${timer}`);
        if(timer) clearTimeout(timer)
        timer = setTimeout(() => cb(cbParameters), d)
        //console.log(`executed: ${timer}`);
    }
}