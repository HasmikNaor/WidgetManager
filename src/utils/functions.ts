import { IWidget } from "./interfaces";

export const generateRandomNumber = () => {
  let randomNumber = Math.floor(Math.random() * 101);
  return randomNumber;
};

export const showRandomWidget = (num: number, array: IWidget[]) => {
  let runningSum = 0;
  const arrOfSums = array.map((item) => {
    runningSum += item.showToPercentage;
    return runningSum;
  });

  const index = arrOfSums.findIndex((item) => item >= num);

  const selectedIndex = index !== -1 ? index : array.length - 1;
  return array[selectedIndex];
};
