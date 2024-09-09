'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import SwitchTheme from '@/components/SwitchTheme'
import logoLight from '@/assets/logo-light-mode.svg'
import logoDark from '@/assets/logo-dark-mode.svg'
import { usePathname, useRouter } from 'next/navigation'
import { ExternalLinkIcon } from 'lucide-react'

const Header = () => {
  const { theme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  return (
    <header className="flex pt-42px pb-31px justify-between items-center">
      {theme === 'dark' ? (
        <Image src={logoDark} alt="logo" />
      ) : (
        <Image src={logoLight} alt="logo" />
      )}

      <div className='flex items-center gap-4'>
        {pathname === '/tokenflow' ? (
          <button
            className='text-white bg-black rounded-[10px] py-1 px-2 '
            onClick={() => { router.push('/') }}
          >
            Go to Analytics Dashboard
          </button>
        ) : (
          <button
            className={`${theme === 'dark' ? 'text-black bg-slate-100' : 'text-white bg-black'} rounded-[10px] py-1 px-2 flex items-center gap-1`}
            onClick={() => { router.push('/tokenflow') }}
          >
            <ExternalLinkIcon className={`${theme === 'dark' ? 'text-black' : 'text-white'} h-4 w-4`} />
            <span>Go to TokenFlow</span>
          </button>
        )}
        <SwitchTheme />
      </div>

    </header>
  )
}

export default Header
