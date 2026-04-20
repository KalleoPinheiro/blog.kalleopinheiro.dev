/**
 * Validation script to check shadcn/ui configuration
 * Run: node src/scripts/validate-config.js
 */

const fs = require("fs")
const path = require("path")

const checks = [
  {
    name: "components.json exists",
    check: () => fs.existsSync(path.join(process.cwd(), "components.json")),
  },
  {
    name: "src/components/ui directory exists",
    check: () => fs.existsSync(path.join(process.cwd(), "src/components/ui")),
  },
  {
    name: "tailwind.config.ts exists",
    check: () => fs.existsSync(path.join(process.cwd(), "tailwind.config.ts")),
  },
  {
    name: "tsconfig.json has @ path alias",
    check: () => {
      const tsconfig = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), "tsconfig.json"), "utf-8")
      )
      return tsconfig.compilerOptions?.paths?.["@/*"] !== undefined
    },
  },
  {
    name: "src/lib/utils/cn.ts exists",
    check: () =>
      fs.existsSync(path.join(process.cwd(), "src/lib/utils/cn.ts")) ||
      fs.existsSync(path.join(process.cwd(), "src/lib/utils.ts")),
  },
  {
    name: "globals.css has Tailwind directives",
    check: () => {
      const globalsPath = path.join(process.cwd(), "src/styles/globals.css")
      if (!fs.existsSync(globalsPath)) return false
      const content = fs.readFileSync(globalsPath, "utf-8")
      return (
        content.includes("@tailwind") &&
        content.includes("--primary") &&
        content.includes("--background")
      )
    },
  },
  {
    name: "package.json has required dependencies",
    check: () => {
      const pkg = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8")
      )
      const required = [
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
        "lucide-react",
      ]
      return required.every((dep) => pkg.dependencies[dep] || pkg.devDependencies[dep])
    },
  },
]

console.log("\n📋 Validating shadcn/ui configuration...\n")

let passed = 0
let failed = 0

checks.forEach((check) => {
  try {
    const result = check.check()
    const status = result ? "✓" : "✗"
    const message = result ? "PASS" : "FAIL"
    console.log(`${status} ${check.name} ... ${message}`)
    if (result) passed++
    else failed++
  } catch (error) {
    console.log(`✗ ${check.name} ... ERROR (${error.message})`)
    failed++
  }
})

console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`)

if (failed > 0) {
  console.log("⚠️  Configuration issues detected. See COMPONENT_SETUP_ERRORS.md for remediation steps.\n")
  process.exit(1)
} else {
  console.log("✅ All configuration checks passed! Ready to add components.\n")
  process.exit(0)
}
