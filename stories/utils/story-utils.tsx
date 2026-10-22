// utils.tsx

/**
 * Array of numbers for storybook controls
 */
export function numberArray(
  name: string,
  defaultArray: Array<number>,
  dim: number = 3,
  groupID?: string
): Array<number> {
  // This function is kept for compatibility but no longer uses knobs
  // In modern Storybook, use object controls instead
  return defaultArray;
}

/**
 * Array of Array of numbers for storybook controls
 */
export function numberArrayArray(
  name: string,
  defaultArray: Array<Array<number>> = [],
  dim: number,
  groupID?: string
): Array<Array<number>> {
  // This function is kept for compatibility but no longer uses knobs
  // In modern Storybook, use object controls instead
  return defaultArray;
}
