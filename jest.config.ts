import type {Config} from "@jest/types"

const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    moduleDirectories: ["node_modules", "src"],
}
export default config