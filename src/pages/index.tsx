import { useEffect } from "react"
import { useHistory } from "@docusaurus/router"

export default function Home(): JSX.Element {
  const history = useHistory()

  useEffect(() => {
    history.push("/docs/intro")
  }, [history])

  return null
}
