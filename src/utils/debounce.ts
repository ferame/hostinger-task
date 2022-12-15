export const debounce = (func: (args: any) => void, time: number) => {
  let timer: NodeJS.Timeout | undefined;

  return (args: any) => {
    clearTimeout(timer);
    timer = setTimeout(func, time, args);
  };
};
