'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

const Themes = {
  LIGHT: 'light',
  DARK: 'dark',
}
const SwitchTheme = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
    setTheme(Themes.LIGHT)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex justify-center">
      <div>
        <div>
          <input
            className="h-[22px] w-[42px] appearance-none rounded-[100px] bg-theme-switcher-background-light dark:bg-theme-switcher-background-dark before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:mt-[0.1rem] after:ml-[0.2rem] after:h-[18px] after:w-[18px] after:rounded-full after:border-none after:bg-neutral-100 dark:after:bg-neutral-400 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary dark:checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:mt-[0.1rem] checked:after:ml-[1.3rem] checked:after:h-[18px] checked:after:w-[18px] checked:after:rounded-full checked:after:border-none checked:after:bg-primary dark:checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer"
            type="checkbox"
            onChange={(e) => {
              if (theme === Themes.LIGHT) {
                setTheme(Themes.DARK)
              } else {
                setTheme(Themes.LIGHT)
              }
            }}
            role="switch"
          />
        </div>
      </div>
    </div>
  )
}

export default SwitchTheme
