; ------------------------------------------------------------------
; --  _____       ______  _____                                    -
; -- |_   _|     |  ____|/ ____|                                   -
; --   | |  _ __ | |__  | (___    Institute of Embedded Systems    -
; --   | | | '_ \|  __|  \___ \   Zurich University of             -
; --  _| |_| | | | |____ ____) |  Applied Sciences                 -
; -- |_____|_| |_|______|_____/   8401 Winterthur, Switzerland     -
; ------------------------------------------------------------------
; --
; -- table.s
; --
; -- CT1 P04 Ein- und Ausgabe von Tabellenwerten
; --
; -- $Id: table.s 800 2014-10-06 13:19:25Z ruan $
; ------------------------------------------------------------------
;Directives
        PRESERVE8
        THUMB
; ------------------------------------------------------------------
; -- Symbolic Literals
; ------------------------------------------------------------------
ADDR_DIP_SWITCH_7_0         EQU     0x60000200
ADDR_DIP_SWITCH_15_8        EQU     0x60000201
ADDR_DIP_SWITCH_31_24       EQU     0x60000203
ADDR_LED_7_0                EQU     0x60000100
ADDR_LED_15_8               EQU     0x60000101
ADDR_LED_23_16              EQU     0x60000102
ADDR_LED_31_24              EQU     0x60000103
ADDR_BUTTONS                EQU     0x60000210

BITMASK_KEY_T0              EQU     0x01
BITMASK_LOWER_NIBBLE        EQU     0x0F

; ------------------------------------------------------------------
; -- Variables
; ------------------------------------------------------------------
        AREA MyAsmVar, DATA, READWRITE
; STUDENTS: To be programmed

	
table SPACE 16 ;16 bytes


; END: To be programmed
        ALIGN

; ------------------------------------------------------------------
; -- myCode
; ------------------------------------------------------------------
        AREA myCode, CODE, READONLY

main    PROC
        EXPORT main

readInput
        BL    waitForKey                    ; wait for key to be pressed and released
; STUDENTS: To be programmed

		;load input index
		LDR		R0, =ADDR_DIP_SWITCH_15_8
		LDR		R1, [R0]
		LDR 	R7, =BITMASK_LOWER_NIBBLE
		ANDS 	R1, R1, R7
		
		;load input value
		LDR 	R2, =ADDR_DIP_SWITCH_7_0
		LDRB	R3, [R2]
		
		; put input index to LED
		LDR		R4, =ADDR_LED_15_8
		STRB	R1, [R4]
		; put input value to LED
		LDR		R5, =ADDR_LED_7_0
		STRB	R3, [R5]
		
		; store input value in table at input index
		LDR		R4, =table
		STR		R3 , [R4, R1]
		
		; read and put output index
		LDR		R0, =ADDR_DIP_SWITCH_31_24
		LDR		R1, [R0]
		ANDS	R1, R1, R7
		LDR		R2, =ADDR_LED_31_24
		STRB	R1, [R2]
		
		; show table[outputindex] in LED
		LDR		R3, [R4, R1]
		LDR		R5, =ADDR_LED_23_16
		STRB	R3, [R5]

; END: To be programmed
        B       readInput
        ALIGN

; ------------------------------------------------------------------
; Subroutines
; ------------------------------------------------------------------

; wait for key to be pressed and released
waitForKey
        PUSH    {R0, R1, R2}
        LDR     R1, =ADDR_BUTTONS           ; laod base address of keys
        LDR     R2, =BITMASK_KEY_T0         ; load key mask T0

waitForPress
        LDRB    R0, [R1]                    ; load key values
        TST     R0, R2                      ; check, if key T0 is pressed
        BEQ     waitForPress

waitForRelease
        LDRB    R0, [R1]                    ; load key values
        TST     R0, R2                      ; check, if key T0 is released
        BNE     waitForRelease
                
        POP     {R0, R1, R2}
        BX      LR
        ALIGN

; ------------------------------------------------------------------
; End of code
; ------------------------------------------------------------------
        ENDP
        END
