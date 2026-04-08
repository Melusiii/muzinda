import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll to top of the window on every route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Instant is better for page transitions to avoid jumpy effects
    })
  }, [pathname])

  return null // This component doesn't render anything
}

export default ScrollToTop
