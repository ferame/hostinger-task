export const debounce = (func: (args: any) => void, time: number): (args: any) => void => {
    let timer: number|undefined;

    return (args: any): void => {
        if(typeof timer === "number") {
            clearTimeout(timer);
        }
        timer = setTimeout(() => func(args), time);
    }
}