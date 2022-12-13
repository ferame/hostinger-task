// TODO: change debounce to have proper types definitions
export const debounce = (func: (args: any) => void, time: number): ((args: any) => void) => {
  let timer: NodeJS.Timer | undefined;

  return (args: any): void => {
    clearTimeout(timer);
    timer = setTimeout(() => func(args), time);
  };
};
