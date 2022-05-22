;Directives
        PRESERVE8
        THUMB

; ------------------------------------------------------------------
; -- Symbolic Literals
; ------------------------------------------------------------------
ADDR_DIP_SWITCH_31_0        EQU     0x60000200
ADDR_BUTTONS                EQU     0x60000210
ADDR_LCD_RED                EQU     0x60000340
ADDR_LCD_GREEN              EQU     0x60000342
ADDR_LCD_BLUE               EQU     0x60000344
ADDR_LCD_BIN                EQU     0x60000330
MASK_KEY_T0                 EQU     0x00000001
BACKLIGHT_FULL              EQU     0xffff

; ------------------------------------------------------------------
; -- myCode
; ------------------------------------------------------------------
        AREA MyCode, CODE, READONLY

main    PROC
        EXPORT main

user_prog
        LDR     R7, =ADDR_LCD_BLUE              ; load base address of pwm blue
        LDR     R6, =BACKLIGHT_FULL             ; backlight full blue
        STRH    R6, [R7]                        ; write pwm register

        LDR     R0, =0                          ; lower 32 bits of total sum
        LDR     R1, =0                          ; higher 32 bits of total sum
		
		LDR     R5, =0                          ; static zero
endless
        BL      waitForKey                      ; wait for key T0 to be pressed
        ; STUDENTS: To be programmed
		
		
		; read input
		LDR   R3, =ADDR_DIP_SWITCH_31_0
		LDR   R2, [R3]
		
		; sum
		ADDS  R0, R0, R2
		ADCS  R1, R1, R5
		
		; display output
		LDR   R3, =ADDR_LCD_BIN
		STR   R0, [R3]
		STR   R1, [R3, #4]


        ; END: To be programmed
        B       endless
        ALIGN


;----------------------------------------------------
; Subroutines
;----------------------------------------------------

; wait for key to be pressed and released
waitForKey
        PUSH    {R0, R1, R2}
        LDR     R1, =ADDR_BUTTONS               ; laod base address of keys
        LDR     R2, =MASK_KEY_T0                ; load key mask T0

waitForPress
        LDRB    R0, [R1]                        ; load key values
        TST     R0, R2                          ; check, if key T0 is pressed
        BEQ     waitForPress

waitForRelease
        LDRB    R0, [R1]                        ; load key values
        TST     R0, R2                          ; check, if key T0 is released
        BNE     waitForRelease

        POP     {R0, R1, R2}
        BX      LR
        ALIGN

; ------------------------------------------------------------------
; End of code
; ------------------------------------------------------------------
        ENDP
        END
