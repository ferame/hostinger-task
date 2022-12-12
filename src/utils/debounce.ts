export const debounce = (func: (args: any) => void, time: number): ((args: any) => void) => {
  let timer: ReturnType<typeof setTimeout>;

  return (args: any): void => {
    if (typeof timer === 'number') {
      clearTimeout(timer);
    }
    timer = setTimeout(() => func(args), time);
  };
};
