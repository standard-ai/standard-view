// utils.js
import { array } from "@storybook/addon-knobs";

/**
 * Array of numbers for storybook knobs
 */
export function numberArray(
  name: string,
  defaultArray: Array<number>,
  dim: number = 3,
  groupID: string
): Array<number> {
  const stringArray = array(name, defaultArray, ",", groupID);
  const numArray = [];
  stringArray.map(val => numArray.push(parseFloat(val)));

  // Validate Elements
  for (const val of numArray) {
    if (Number.isNaN(val)) {
      return undefined;
    }
  }

  // Validate Dimensions
  if (numArray.length !== dim) {
    return undefined;
  }

  return numArray;
}

/**
 * Array of Array of numbers for storybook knobs
 */
export function numberArrayArray(
  name: string,
  defaultArray: Array<Array<number>> = [],
  dim: number,
  groupID: string
): Array<Array<number>> {
  const stringArray = array(name, defaultArray, ",", groupID);

  // Initial defaultArray is not converted to string, unlike input
  if (stringArray.length > 0 && typeof stringArray[0] !== "string") {
    return stringArray;
  }

  const arrayOfArrays = [];
  const arrayCount = Math.floor(stringArray.length / dim);
  for (let i = 0; i < arrayCount; i++) {
    const numArray = [];
    for (let j = 0; j < dim; j++) {
      numArray.push(parseFloat(stringArray[i * dim + j]));
    }
    arrayOfArrays.push(numArray);
  }
  return arrayOfArrays.length != 0 ? arrayOfArrays : undefined;
}
