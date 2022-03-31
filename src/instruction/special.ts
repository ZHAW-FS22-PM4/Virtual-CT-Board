import { Halfword } from 'types/binary'

/**
 * A special instruction which signals the processor the 'end of code' and therefor it should halt.
 *
 * On an actual board the processor would never halt the execution and would just continue to try to execute something.
 */
export const END_OF_CODE = Halfword.fromUnsignedInteger(0xffff)
