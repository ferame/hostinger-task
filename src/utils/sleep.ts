export const sleep = async (time: number) => {
  await new Promise((res) => setTimeout(res, time));
};
