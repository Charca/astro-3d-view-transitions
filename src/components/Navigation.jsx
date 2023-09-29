import { useState, useEffect } from 'react'

export const Navigation = () => {
  const [current, setCurrent] = useState()

  function setActive(path) {
    const normalizedPath = path.replace(/\/$/, '')
    switch (normalizedPath) {
      case '':
        setCurrent('dashboard')
        break
      case '/journal':
        setCurrent('journal')
        break
      case '/profile':
        setCurrent('profile')
        break
      default:
        break
    }
  }

  useEffect(() => {
    function setActivePath() {
      setActive(window.location.pathname)
    }

    setActivePath()

    document.addEventListener('route-change', setActivePath)

    return () => {
      document.removeEventListener('route-change', setActivePath)
    }
  }, [])

  function getClassName(name) {
    return current === name ? 'text-orange-500' : ''
  }

  function handleNavigation(event) {
    if (!event.target?.href) return

    const url = new URL(event.target.href)
    const path = url.pathname

    setActive(path)

    setTimeout(() => {
      document.dispatchEvent(
        new CustomEvent('route-navigation', {
          detail: {
            path,
          },
        })
      )
    })
  }

  return (
    <nav
      className="top-0 rounded-3xl border-zinc-800 border-4 p-8 flex gap-5 justify-center mx-auto my-8 w-fit bg-white text-zinc-800 font-semibold"
      onClick={handleNavigation}
    >
      <a href="/" className={getClassName('dashboard')}>
        Dashboard
      </a>
      <a href="/journal" className={getClassName('journal')}>
        Journal
      </a>
      <a href="/profile" className={getClassName('profile')}>
        Profile
      </a>
    </nav>
  )
}
