import BackgroundBlur from '@/components/BackgroundBlur'
import Footer from '@/components/Footer'
import Transition from '@/components/Transition'

import ServiceCard from './components/serviceCard/ServiceCard'
import { SERVICES } from './constants/services.constants'

const ServicesPage = async () => {
  return (
    <Transition>
      <section className="dark relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden px-2 pt-24 sm:px-0">
        <BackgroundBlur className="py-16">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-3xl font-bold">Szolgáltatásaink</h1>
            <h2 className="text-lg">
              Fedezd fel szolgáltatásainkat, melyekhez vegán és környezetbarát
              termékeket használok!
            </h2>
          </div>

          <div>
            {SERVICES.map((service, index) => (
              <ServiceCard key={service.name} service={service} index={index} />
            ))}
          </div>
        </BackgroundBlur>
      </section>

      <Footer />
    </Transition>
  )
}

export default ServicesPage
