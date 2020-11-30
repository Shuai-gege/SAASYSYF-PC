import defaultSettings from '@/settings'

const title = defaultSettings.title || '南京盈商云服'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
