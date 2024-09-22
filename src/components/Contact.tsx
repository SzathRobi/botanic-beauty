import { Mail, MapPin, Smartphone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
} from '@/constants/contact.constants'

import BackgroundBlur from './BackgroundBlur'
import FadeInView from './FadeInView'
import Title from './Title'

const Contact = () => {
  return (
    <section className="mb-40 min-h-screen px-2 sm:px-0">
      <Image
        alt="Botanic Beauty fodrászat"
        src="/contact-bg.png"
        fill
        className="object-fit -z-10 min-h-[110vh]"
      />
      <FadeInView>
        <Title title="Elérhetőség / média" />
        <div>
          <BackgroundBlur className="mx-auto flex max-w-5xl flex-col gap-16">
            <div className="flex flex-col items-start justify-center gap-12 sm:flex-row">
              <div className="flex flex-row items-center justify-start gap-2 sm:flex-col sm:justify-center">
                <MapPin size={72} className="size-12 md:size-16" />
                <p className="max-w-[20ch] text-left text-sm sm:text-center md:text-base">
                  {CONTACT_ADDRESS}
                </p>
              </div>
              <div className="flex flex-row items-center justify-start gap-2 sm:flex-col sm:justify-center">
                <Mail size={72} className="size-12 md:size-16" />
                <p className="md:max-w-auto min-w-[25ch] max-w-20 text-sm md:text-base">
                  {CONTACT_EMAIL}
                </p>
              </div>
              <div className="flex flex-row items-center justify-start gap-2 sm:flex-col sm:justify-center">
                <Smartphone size={72} className="size-12 md:size-16" />
                <p className="text-sm md:text-base">{CONTACT_PHONE}</p>
              </div>
            </div>

            <div className="flex flex-col items-start justify-center gap-12 pl-2 sm:flex-row sm:pl-0">
              <div className="relative flex flex-row items-center justify-center gap-4 sm:flex-col sm:items-start sm:gap-2">
                <div className="relative mx-auto size-12 md:size-16">
                  <a
                    href="https://www.instagram.com/botanic_beauty_hajszalon"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      alt="Botanic Beauty hajszalon instagramja"
                      src="/instagram-80x80.png"
                      fill
                      className="object-cover"
                    />
                  </a>
                </div>
                <p className="text-sm md:text-base">instagram</p>
              </div>
              <div className="relative flex flex-row items-center justify-center gap-4 sm:flex-col sm:items-start sm:gap-2">
                <div className="relative mx-auto size-12 md:size-16">
                  <a
                    href="https://www.facebook.com/profile.php?id=61563419040169"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      alt="Botanic Beauty hajszalon facebookja"
                      src="/facebook-80x80.png"
                      fill
                      className="object-cover"
                    />
                  </a>
                </div>
                <p className="text-sm md:text-base">facebook</p>
              </div>
            </div>
          </BackgroundBlur>
        </div>
      </FadeInView>
    </section>
  )
}

export default Contact
