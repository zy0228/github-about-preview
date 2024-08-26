import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"     
import debounce from "./lib/debounce"

export const config: PlasmoCSConfig = {
  matches: ["https://github.com/*"]
}

type Repos = {
  url: string
  wrapper: HTMLElement
}

export default () => {
  useEffect(() => {
    new MutationObserver(debounce(injectFunc, 1000)).observe(document.body, {
      childList: true,
      subtree: true
    })
  }, [])

  const injectFunc = () => {
    const rootDom: Element = document.querySelector("#user-starred-repos")
    const repos: HTMLAnchorElement[] = Array.from(rootDom.querySelectorAll('a')).filter(a => !a.className)
    const composeData: Repos[]  = repos.map(repo => {
      return ({
        url: repo.href,
        wrapper: repo.parentElement.parentElement.parentElement
      })
    })
    composeData.forEach(ref => {
      fetch(ref.url).then(res => res.text()).then(htmlString => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlString, 'text/html')

        const reviewNode: HTMLAnchorElement | null = doc.querySelector("#repo-content-pjax-container > div > div > div.Layout.Layout--flowRow-until-md.react-repos-overview-margin.Layout--sidebarPosition-end.Layout--sidebarPosition-flowRow-end > div.Layout-sidebar > div > div:nth-child(1) > div > div > div.my-3.d-flex.flex-items-center")
        const reviewURL = reviewNode?.querySelector("a")?.href
        console.log(reviewURL)

        if (reviewNode as HTMLAnchorElement) {
          const aAnchors: HTMLAnchorElement[] = Array.from(ref.wrapper.querySelectorAll('a'))
          const hasReview = aAnchors.some(a => a.href === reviewURL)
          if (!hasReview) {
            ref.wrapper.appendChild(reviewNode)
          }
        }
      })
    })
    console.log(composeData)
  }
  return <h1></h1>
}