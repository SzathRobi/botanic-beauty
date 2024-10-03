import { GoogleMapsEmbed } from '@next/third-parties/google'
import { Mail, MapPin, Smartphone } from 'lucide-react'
import { FaInstagram } from 'react-icons/fa'
import { TiSocialFacebook } from 'react-icons/ti'

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
    <section className="relative mb-40 min-h-screen px-2 sm:px-0">
      <FadeInView>
        <Title title="Elérhetőség / média" />
        <div>
          <BackgroundBlur className="mx-auto flex max-w-5xl flex-col gap-16">
            <div className="grid grid-cols-1 place-items-center gap-8 lg:grid-cols-2">
              <div className="flex w-full flex-col items-start justify-start gap-10">
                <div className="flex flex-row items-center justify-start gap-2 sm:flex-col sm:justify-center lg:items-start">
                  <MapPin size={48} className="size-12 text-emerald-600" />
                  <p className="text-left text-sm sm:text-center md:text-base">
                    {CONTACT_ADDRESS}
                  </p>
                </div>

                <div className="flex flex-row items-center justify-start gap-2 sm:flex-col sm:justify-center lg:items-start">
                  <Mail size={48} className="size-12 text-emerald-600" />
                  <p className="md:max-w-auto min-w-[25ch] max-w-20 text-sm md:text-base">
                    {CONTACT_EMAIL}
                  </p>
                </div>

                <div className="flex flex-row items-center justify-start gap-2 sm:flex-col sm:justify-center lg:items-start">
                  <Smartphone size={48} className="size-12 text-emerald-600" />
                  <p className="text-sm md:text-base">{CONTACT_PHONE}</p>
                </div>

                <a
                  href="https://www.instagram.com/botanic_beauty_hajszalon"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="flex flex-row items-center justify-start gap-2 sm:flex-col sm:justify-center lg:items-start">
                    <FaInstagram
                      size={48}
                      className="size-12 text-emerald-600"
                    />
                    <p className="text-sm md:text-base">
                      Botanic Beauty Hajszalon instagram
                    </p>
                  </div>
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=61563419040169"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="flex flex-row items-center justify-start gap-2 sm:flex-col sm:justify-center lg:items-start">
                    <TiSocialFacebook
                      size={48}
                      className="size-12 border-emerald-600 text-emerald-600"
                    />
                    <p className="text-sm md:text-base">
                      Botanic Beauty Hajszalon facebook
                    </p>
                  </div>
                </a>
              </div>

              <div className="w-full overflow-hidden rounded-lg">
                <GoogleMapsEmbed
                  apiKey={process.env.GOOGLE_MAP_KEY || ''}
                  height="560"
                  width="100%"
                  mode="place"
                  q="Botanic+Beauty+Hajszalon/@47.5528604,19.0930567,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc6d532b770f8b:0xa2a919b3f5430a1!8m2!3d47.5528568!4d19.0956316!16s%2Fg%2F11wc9r2vsx?hl=hu-HU&entry=ttu&g_ep=EgoyMDI0MDkyOS4wIKXMDSoASAFQAw%3D%3D"
                />
              </div>
            </div>
          </BackgroundBlur>
        </div>
      </FadeInView>
    </section>
  )
}

export default Contact
