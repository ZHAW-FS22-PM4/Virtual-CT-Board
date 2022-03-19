import { IInstruction } from "assembler/ast";
import { removeNonCode, createInstructions } from "../../src/assembler/parser";

//// create test data

// for testing removeNonCode
const testCommentsString1: string[] = ["; output", "ADDR_LED_31_0        EQU    0x60000100"]
const testCommentsString2: string[] = ["ADDR_LED_31_0        EQU    0x60000100 ; address LEDs"]
const testEmptyLinesString: string[] = ["STRH 		R7, [R1, #2]", "    ", ""]

//for testing createInstructions
const singleInstruction: string[] = ["		LDR 		R7, =LCD_BACKLIGHT_OFF"]
const resultSingleInstruction: IInstruction[] = [ {name: "LDR", label: "", params: ["R7", "=LCD_BACKLIGHT_OFF"]} ]

const multipleInstructions: string[] = ["	LDR 		R7, =LCD_BACKLIGHT_OFF", "   STRH		R7, [R1, #4]", ]
const resultMultipleInstructions: IInstruction[] = [
    {name: "LDR", label: "", params: ["R7", "=LCD_BACKLIGHT_OFF"]}, 
    {name: "STRH", label: "", params: ["R7", "[R1", "#4]"]} ]

const instructionWithBranch: string[] = ["B			display"]
const resultInstructionWithBranch: IInstruction[] = [ {name: "B", label: "", params: ["display"]} ]

const instructionWithLabel: string[] = ["blue			LDR			R1, =ADDR_LCD_COLOUR" ]
const resultInstructionWithLabel: IInstruction[] = [{name: "LDR", label: "blue", params: ["R1", "=ADDR_LCD_COLOUR"]}]

//// tests

describe("test removeNonCode function", () => {
    it("should return code without comments in a separate line", () => {
        expect(removeNonCode(testCommentsString1)).toStrictEqual(["ADDR_LED_31_0        EQU    0x60000100"]);
    });
    it("should return code without comments on the same line", () => {
        expect(removeNonCode(testCommentsString2)).toStrictEqual(["ADDR_LED_31_0        EQU    0x60000100 "]);
    });
    it("should return code without empty lines", () => {
        expect(removeNonCode(testEmptyLinesString)).toStrictEqual(["STRH 		R7, [R1, #2]"]);
    });
});

describe("test createInstructions function", () => {
    it("should create a single instruction", () => {
        expect(createInstructions(singleInstruction)).toStrictEqual(resultSingleInstruction)
    });
    it("should create multiple instructions in an array", () => {
        expect(createInstructions(multipleInstructions)).toStrictEqual(resultMultipleInstructions)
    });
    it("should create instruction with branch name in params", () => {
        expect(createInstructions(instructionWithBranch)).toStrictEqual(resultInstructionWithBranch)
    });
    it("should create instruction with label name in param label", () => {
        expect(createInstructions(instructionWithLabel)).toStrictEqual(resultInstructionWithLabel)
    });

});