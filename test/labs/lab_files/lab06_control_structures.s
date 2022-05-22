; -------------------------------------------------------------------
; -- Constants
; -------------------------------------------------------------------
    
                AREA myCode, CODE, READONLY
                    
                THUMB

ADDR_LED_15_0           EQU     0x60000100
ADDR_LED_31_16          EQU     0x60000102
ADDR_7_SEG_BIN_DS1_0    EQU     0x60000114
ADDR_DIP_SWITCH_15_0    EQU     0x60000200
ADDR_HEX_SWITCH         EQU     0x60000211
	
LOWER_NIBBLE_MASK       EQU     0xF

NR_CASES        		EQU     0xB

                ; ordered table containing the labels of all cases
                ; STUDENTS: to be programmed 
jump_table		DCD case_dark
				DCD case_1
				DCD case_2
				DCD case_3
				DCD case_4
				DCD case_5
				DCD case_6
				DCD case_7
				DCD case_8
				DCD case_9
				DCD case_A
				

                ; END: to be programmed
    

; -------------------------------------------------------------------
; -- Main
; -------------------------------------------------------------------   
                        
main            PROC
                EXPORT main
                
read_dipsw      ; Read operands into R0 and R1 and display on LEDs
                ; STUDENTS: to be programmed
				LDR  R7,=ADDR_DIP_SWITCH_15_0
				LDRB R1,[R7]
				LDRB R0,[R7,#1]
				LDR  R7,=ADDR_LED_15_0
				STRB R1,[R7]
				STRB R0,[R7,#1]

                ; END: to be programmed
                    
read_hexsw      ; Read operation into R2 and display on 7seg.
                ; STUDENTS: to be programmed
				LDR  R7,=ADDR_HEX_SWITCH
				LDRB R2,[R7]
				LDR  R6,=LOWER_NIBBLE_MASK
				ANDS R2,R2,R6
				LDR  R7,=ADDR_7_SEG_BIN_DS1_0
				STRB R2,[R7]

                ; END: to be programmed
                
case_switch     ; Implement switch statement as shown on lecture slide
                ; STUDENTS: to be programmed
				CMP  R2,#NR_CASES
				BHS  case_default
				LSLS R2,#2
				LDR  R7,=jump_table
				LDR  R7,[R7,R2]
				BX   R7

                ; END: to be programmed


; Add the code for the individual cases below
; - operand 1 in R0
; - operand 2 in R1
; - result in R0

case_dark       
                LDR  R0,=0
                B    display_result
case_1        
                ADDS R0,R0,R1
                B    display_result
case_2
				SUBS R0,R0,R1
				B    display_result
case_3
				MULS R0,R1,R0
				B    display_result
case_4
				ANDS R0,R0,R1
				B    display_result
case_5
				ORRS R0,R0,R1
				B    display_result
case_6
				EORS R0,R0,R1
				B    display_result
case_7
				MVNS R0,R0
				B    display_result
case_8
				ANDS R0,R0,R1
				MVNS R0,R0
				B    display_result			
case_9
				ORRS R0,R0,R1
				MVNS R0,R0
				B    display_result
case_A
				EORS R0,R0,R1
				MVNS R0,R0
				B    display_result
case_default
				LDR R0,=0xffff

; STUDENTS: to be programmed


; END: to be programmed


display_result  ; Display result on LEDs
                ; STUDENTS: to be programmed
				LDR  R7,=ADDR_LED_31_16
				STRH R0,[R7]

                ; END: to be programmed

                B    read_dipsw
                
                ALIGN
                ENDP

; -------------------------------------------------------------------
; -- End of file
; -------------------------------------------------------------------                      
                END

