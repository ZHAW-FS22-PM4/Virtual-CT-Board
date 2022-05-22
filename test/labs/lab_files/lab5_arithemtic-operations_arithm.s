;Directives
        PRESERVE8
        THUMB

; ------------------------------------------------------------------
; -- myCode
; ------------------------------------------------------------------
        AREA MyCode, CODE, READONLY

main    PROC
        EXPORT main

user_prog
        
; ------------------------------------------------------------------
; -- Increment/Decrement with ADDS and SUBS
        MOVS    R1, #0
        ADDS    R1, R1, #1
        ADDS    R1, R1, #1
        SUBS    R1, R1, #1
        SUBS    R1, R1, #1
        SUBS    R1, R1, #1
        SUBS    R1, R1, #1
        SUBS    R1, R1, #1
        ADDS    R1, R1, #1
        ADDS    R1, R1, #1
        ADDS    R1, R1, #1
        ADDS    R1, R1, #1
        ADDS    R1, R1, #1
        
        
; ------------------------------------------------------------------
; -- ADDS and SUBS (negative, positive, overflow)
        LDR     R0, =0x6a000000
        LDR     R1, =0x2efffffe
        ADDS    R1, R1, R1
        ADDS    R0, R0, R1
        ADDS    R0, R0, R1
        
        LDR     R0, =0xa1000000
        LDR     R1, =0x5efffffe
        SUBS    R0, R0, R1
        SUBS    R0, R0, R1

; ------------------------------------------------------------------
; -- ADDS and RSBS vs. SUBS (compare R0 and R2)
        LDR     R0, =0x4a000000
        LDR     R1, =0x2efffffe
        MOV     R2, R0

        SUBS    R0, R0, R1
        RSBS    R1, R1, #0
        ADDS    R2, R2, R1

; ------------------------------------------------------------------
; -- MUL flags and cut-off if result needs more than 32 bits
        LDR     R0, =0x0000e200
        LDR     R1, =0x00002201
        
        MULS    R0, R1, R0
        LDR     R1, =0x00000f20
        MULS    R0, R1, R0
        MULS    R0, R1, R0

        B       user_prog
        ALIGN
; ------------------------------------------------------------------
; End of code
; ------------------------------------------------------------------
        ENDP
        END