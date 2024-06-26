const fs = require("fs")
const path = require("path")
const matter = require("gray-matter")

const docsDir = path.join(__dirname, "docs")
const buildMdxDir = path.join(__dirname, "build", "mdx")

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

let positionCounter = 1

function traverseAndCopyMdxFiles(dir) {
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      traverseAndCopyMdxFiles(filePath)
    } else if (file.endsWith(".mdx")) {
      const content = fs.readFileSync(filePath, "utf8")
      const { data, content: mdxContent } = matter(content)

      if (data.slug) {
        data.overview_position = positionCounter++
        const newContent = matter.stringify(mdxContent, data)
        const newFilePath = path.join(buildMdxDir, `${data.slug}.mdx`)
        fs.writeFileSync(newFilePath, newContent)
      }
    }
  })
}

function main() {
  ensureDirSync(buildMdxDir)
  traverseAndCopyMdxFiles(docsDir)
  console.log("MDX files copied successfully.")
}

main()
