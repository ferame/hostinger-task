const debounce = (randomFunc: (args: any) => void, time: number): (args: any) => void => {
    let timer: number|undefined;

    return (args: any): void => {
        if(typeof timer === "number") {
            clearTimeout(timer);
        }
        timer = setTimeout(() => randomFunc(args), time);
    }
} 

export default debounce;