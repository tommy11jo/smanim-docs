const fs = require("fs")
const path = require("path")
const matter = require("gray-matter")

const extractMetadataFromMDX = (filePath) => {
  const content = fs.readFileSync(filePath, "utf-8")
  const { data, content: mdxContent } = matter(content)

  const metadata = {
    description: "",
    examples: [],
    overview_position: data.overview_position || 1000,
  }

  const descriptionMatch = mdxContent.match(/###\s*Description\s*(.*?)\s*###/is)
  if (descriptionMatch) {
    metadata.description = descriptionMatch[1].trim()
  }

  const exampleMatches = mdxContent.match(/###\s*Examples\s*(.*?)$/gis)
  if (exampleMatches) {
    const exampleSection = exampleMatches[0]
    const exampleDescriptions = exampleSection.match(
      /####\s*Example\s*\d+\s*(.*?)\s*```/gis
    )
    if (exampleDescriptions) {
      metadata.examples = exampleDescriptions.map((match) => {
        const exampleDescription = match.match(
          /####\s*Example\s*\d+\s*(.*?)\s*```/is
        )
        return exampleDescription ? exampleDescription[1].trim() : ""
      })
    }
  }

  return metadata
}

const generateOverviewMarkdown = (docsDir) => {
  const overviewItems = []
  const pageOverviews = []

  const files = fs.readdirSync(docsDir)

  files.forEach((file) => {
    const filePath = path.join(docsDir, file)
    if (file.endsWith(".mdx")) {
      const metadata = extractMetadataFromMDX(filePath)
      const fileRelativePath = path.relative(docsDir, filePath)

      if (file.match(/-overview\.mdx$/)) {
        let overviewContent = fs.readFileSync(filePath, "utf-8")

        overviewContent = matter(overviewContent).content
        overviewContent = overviewContent
          .replace(/^\s*#\s*Overview\s*/i, "")
          .trim()

        pageOverviews.push({
          name: file,
          slug: file.replace("-overview.mdx", ""),
          path: fileRelativePath,
          description: overviewContent,
        })
      } else {
        overviewItems.push({
          name: file,
          path: fileRelativePath,
          description: metadata.description,
          examples: metadata.examples,
          position: metadata.overview_position,
        })
      }
    }
  })

  overviewItems.sort((a, b) => a.position - b.position)

  const overviewLines = ["# Documentation Overview\n"]

  if (pageOverviews.length > 0) {
    overviewLines.push("## Page Overviews\n")
    pageOverviews.forEach((item) => {
      overviewLines.push(`### ${item.slug} Overview`)
      overviewLines.push(item.description)
      overviewLines.push("")
    })
  }

  overviewLines.push("## Detailed Documentation Overview\n")
  overviewItems.forEach((item) => {
    overviewLines.push(`- [${item.name}](${item.path})`)
    if (item.description) {
      overviewLines.push(`  - Description: ${item.description}`)
    }
    item.examples.forEach((example, index) => {
      overviewLines.push(`  - Example ${index + 1}: ${example}`)
    })
  })

  return overviewLines.join("\n")
}

const docsDir = path.resolve("build/mdx")
const overviewPath = path.join("build/mdx", "overview.mdx")

try {
  const overviewMarkdown = generateOverviewMarkdown(docsDir)
  fs.writeFileSync(overviewPath, overviewMarkdown, "utf-8")
  console.log("Overview MDX generated successfully.")
} catch (error) {
  console.error("Error generating overview:", error)
}
