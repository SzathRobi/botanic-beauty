import { Link, Text } from '@react-email/components'

import { CONTACT_ADDRESS, CONTACT_PHONE } from '@/constants/contact.constants'

const EmailFooter = () => {
  return (
    <Text
      style={{
        textAlign: 'center',
        fontSize: 12,
        color: 'rgb(0,0,0, 0.7)',
      }}
    >
      Botanic Beauty Szalon, {CONTACT_ADDRESS} |{' '}
      <Link href="https://www.botanic-beauty.hu">www.botanic-beauty.hu</Link> |{' '}
      {CONTACT_PHONE}
    </Text>
  )
}

export default EmailFooter
