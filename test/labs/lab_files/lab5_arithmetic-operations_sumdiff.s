;Directives
        PRESERVE8
        THUMB

; ------------------------------------------------------------------
; -- Symbolic Literals
; ------------------------------------------------------------------
ADDR_DIP_SWITCH_7_0     EQU     0x60000200
ADDR_DIP_SWITCH_15_8    EQU     0x60000201
ADDR_LED_7_0            EQU     0x60000100
ADDR_LED_15_8           EQU     0x60000101
ADDR_LED_23_16          EQU     0x60000102
ADDR_LED_31_24          EQU     0x60000103

; ------------------------------------------------------------------
; -- myCode
; ------------------------------------------------------------------
        AREA MyCode, CODE, READONLY

main    PROC
        EXPORT main

user_prog
        ; STUDENTS: To be programmed
		
		; read operand A
		LDR   R1, =ADDR_DIP_SWITCH_15_8
		LDRB  R0, [R1]
		LSLS  R0, R0, #24
		
		; read operand B
		LDR   R2, =ADDR_DIP_SWITCH_7_0
		LDRB  R1, [R2]
		LSLS  R1, R1, #24
		
		; sum A+B, get flags, shift right
		ADDS  R3, R0, R1
		MRS   R7, APSR
		LSRS  R3, R3, #24
		LSRS  R7, R7, #24
		
		; display sum results and flags
		LDR   R4, =ADDR_LED_7_0
		STRB  R3, [R4]
		LDR   R5, =ADDR_LED_15_8
		STRB  R7, [R5]
		
		; difference A-B, get flags, shift right
		SUBS  R3, R0, R1
		MRS   R7, APSR
		LSRS  R3, R3, #24
		LSRS  R7, R7, #24
		
		; display diff results and flags
		LDR   R4, =ADDR_LED_23_16
		STRB  R3, [R4]
		LDR   R5, =ADDR_LED_31_24
		STRB  R7, [R5]

        ; END: To be programmed
        B       user_prog
        ALIGN
; ------------------------------------------------------------------
; End of code
; ------------------------------------------------------------------
        ENDP
        END
