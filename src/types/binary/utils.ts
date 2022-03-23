export function checkRange(
  name: string,
  value: number,
  min: number,
  max: number
) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(
      `OutOfRange: ${name} must be an integer in range ${min} to ${max}.`
    )
  }
}
