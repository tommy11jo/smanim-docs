const fs_ = require("fs")
const path_ = require("path")

module.exports = (req, res) => {
  const { slug } = req.query

  if (typeof slug !== "string") {
    return res.status(400).send("Invalid slug")
  }

  // Use process.cwd() to get the root directory of the project
  const mdxFilePath = path_.join(process.cwd(), "build/mdx", `${slug}.mdx`)

  console.log(`Looking for MDX file at path: ${mdxFilePath}`)

  if (fs_.existsSync(mdxFilePath)) {
    res.setHeader("Content-Type", "text/markdown")
    const fileContent = fs_.readFileSync(mdxFilePath, "utf-8")
    res.send(fileContent)
  } else {
    console.error(`MDX file not found at path: ${mdxFilePath}`)
    res.status(404).send("MDX file not found")
  }
}
