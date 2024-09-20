import Image from 'next/image'
import { FcGoogle } from 'react-icons/fc'

import { signIn } from '@/auth'
import BackgroundBlur from '@/components/BackgroundBlur'
import { Button } from '@/components/Button'

const LoginPage = async () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <BackgroundBlur className="!max-w-md">
        <Image
          src="/logo-only-head.svg"
          alt="Logo"
          width={71}
          height={80}
          className="mx-auto mb-4"
        />
        <form
          action={async () => {
            'use server'
            await signIn('google', { redirectTo: '/admin' })
          }}
          className="flex flex-col items-center justify-center space-y-4"
        >
          <h1 className="mb-4">Botanic Beauty Booking</h1>
          <Button type="submit">
            <FcGoogle className="mr-2" /> Bejelentkezés
          </Button>
        </form>
      </BackgroundBlur>
    </div>
  )
}

export default LoginPage
