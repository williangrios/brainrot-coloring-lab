import type { ColoringPage } from './coloringPages'

let remotePages: ColoringPage[] = []

export function setRemotePages(pages: ColoringPage[]) {
  remotePages = pages
}

export function getRemotePages(): ColoringPage[] {
  return remotePages
}

export function getRemotePageById(id: string): ColoringPage | undefined {
  return remotePages.find((p) => p.id === id)
}
