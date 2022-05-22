; ------------------------------------------------------------------
;Directives
        PRESERVE8
        THUMB

; ------------------------------------------------------------------
; -- Address Defines
; ------------------------------------------------------------------

ADDR_LED_15_0           EQU     0x60000100
ADDR_LED_31_16          EQU     0x60000102
ADDR_DIP_SWITCH_7_0     EQU     0x60000200
ADDR_DIP_SWITCH_15_8    EQU     0x60000201
ADDR_7_SEG_BIN_DS3_0    EQU     0x60000114
ADDR_BUTTONS            EQU     0x60000210

ADDR_LCD_RED            EQU     0x60000340
ADDR_LCD_GREEN          EQU     0x60000342
ADDR_LCD_BLUE           EQU     0x60000344
LCD_BACKLIGHT_FULL      EQU     0xffff
LCD_BACKLIGHT_OFF      EQU     0x0000

BITMASK_LOWER_NIBBLE    EQU     0x0F
BITMASK_KEY_T0          EQU     0x01

; ------------------------------------------------------------------
; -- myCode
; ------------------------------------------------------------------
        AREA myCode, CODE, READONLY

        ENTRY

main    PROC
        export main
            
; STUDENTS: To be programmed

; Task 1 ? BCD to Binary
; ----------------------

        ; load bitmask
		LDR   R7, =BITMASK_LOWER_NIBBLE
		
		; read BCD ones
		LDR   R0, =ADDR_DIP_SWITCH_7_0
		LDRB  R0, [R0]
		ANDS  R0, R0, R7
		
		; read BCD tens
		LDR   R1, =ADDR_DIP_SWITCH_15_8
		LDRB  R1, [R1]
		ANDS  R1, R1, R7
		
		; combine BCD ones and tens
		LSLS  R2, R1, #4
		ADDS  R2, R2, R0
		
		; display BCD value
		LDR   R7, =ADDR_LED_15_0
		STRB  R2, [R7]
		
		; check if T0 is pressed
		LDR   R4, =ADDR_BUTTONS
		LDR   R5, =BITMASK_KEY_T0
		LDRB  R6, [R4]
		TST   R6, R5
		BNE   alternative_multiplication
		
		; set LCD blue
		LDR   R4, =ADDR_LCD_RED
		LDR	  R5, =LCD_BACKLIGHT_OFF
		STR	  R5, [R4]
		LDR   R4, =ADDR_LCD_BLUE
		LDR	  R5, =LCD_BACKLIGHT_FULL
		STR	  R5, [R4]
		
		; calculate binary value
		MOVS  R3, #10
		MULS  R3, R1, R3
		ADDS  R3, R3, R0
		
		; jump to display_values
		B     display_values

alternative_multiplication
		; set LCD red
		LDR   R4, =ADDR_LCD_BLUE
		LDR	  R5, =LCD_BACKLIGHT_OFF
		STR	  R5, [R4]
		LDR   R4, =ADDR_LCD_RED
		LDR	  R5, =LCD_BACKLIGHT_FULL
		STR	  R5, [R4]
		
		; calculate binary value
		LSLS  R4, R1, #3
		LSLS  R5, R1, #1
		ADDS  R3, R4, R5
		ADDS  R3, R3, R0
		
		; jump to display_values
		B     display_values
		
display_values
		; display binary value
		STRB  R3, [R7, #1]
		
		; display bcd and binary on 7 seg
		LDR   R7, =ADDR_7_SEG_BIN_DS3_0
		STRB  R2, [R7]
		STRB  R3, [R7, #1]
		
		
; Task 2 ? Rotating ?Disco Lights?
; --------------------------------

		MOVS  R0, R3	; binary value
		MOVS  R1, #0	; ones counter
		MOVS  R2, #0	; 0 for comparison
		MOVS  R3, #1	; 1 for right shift
		MOVS  R4, #16	; 16 for right shift limit
		B     find_ones
		
find_ones
		CMP   R0, R2
		BEQ   ones_found
		LSRS  R0, R0, #1
		BCS   one_detected
		B     find_ones
		
one_detected
		LSLS  R1, R1, #1
		ADDS  R1, #1
		B     find_ones
		
ones_found		
		LDR   R7, =ADDR_LED_31_16
		MOVS  R2, R1
		LSLS  R2, #16
		ORRS  R1, R2
		B     rotate
		
rotate		
		STRH  R1, [R7]
		RORS  R1, R3
		BL    pause
		SUBS  R4, #1
		BNE   rotate
		
; END: To be programmed
        B       main
        ENDP
            
;----------------------------------------------------
; Subroutines
;----------------------------------------------------

;----------------------------------------------------
; pause for disco_lights
pause           PROC
        PUSH    {R0, R1}
        LDR     R1, =1
        LDR     R0, =0x000FFFFF
        
loop        
        SUBS    R0, R0, R1
        BCS     loop
    
        POP     {R0, R1}
        BX      LR
        ALIGN
        ENDP

; ------------------------------------------------------------------
; End of code
; ------------------------------------------------------------------
        END
