/**
 * Filters an updateData object to include only the properties specified in the list and are not undefined.
 *
 * @template T - The type of the object.
 * @param {Partial<T>} updateData - The object to filter.
 * @param {Array<keyof T>} list - An array of keys to include in the result.
 * @returns {Partial<T>} A new object containing only the specified keys with defined values.
 */
export function cleanObject<T>(
  updateData: Partial<T>,
  list: (keyof T)[],
): Partial<T> {
  const cleanObj: Partial<T> = {}; // Initialize an empty object to hold the filtered data.

  // Iterate over each key in the list
  for (const key of list) {
    // Check if the key exists in updateData and its value is not undefined
    if (updateData[key] !== undefined) {
      cleanObj[key] = updateData[key]; // Add the key-value pair to the cleanObj
    }
  }

  return cleanObj; // Return the filtered object
}
