import { Constants } from './Constants';

export const randomPositionOfEnemy = () => {
  const x = Math.random() * Constants.MAX_WIDTH;
  // console.warn(x, x, x);
  return x;
};
export const randomSizes = () => {
  const x = Math.random() * 100 + 10;
  return [x, x];
};
