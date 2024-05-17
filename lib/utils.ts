export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const decimalFloor = (value: number, base: number) => {
  return Math.floor(value * base) / base;
}
