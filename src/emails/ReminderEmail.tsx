import { Booking } from '@prisma/client'
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

import EmailFooter from './EmailFooter'

interface ReminderEmailProps {
  booking: Booking
}

export const ReminderEmail = ({ booking }: ReminderEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Foglalás emlékeztető</Preview>
      <Body style={main}>
        <Container>
          <Section style={content}>
            <Row>
              <Img
                style={image}
                width={620}
                src="https://github.com/SzathRobi/botanic-beauty/blob/main/src/emails/email-hero.png?raw=true"
              />
            </Row>

            <Row style={{ ...boxInfos, paddingBottom: '0' }}>
              <Column>
                <Heading
                  style={{
                    fontSize: 24,
                    fontWeight: 'normal',
                    textAlign: 'left',
                  }}
                >
                  Kedves {booking.contactInfo.name},
                </Heading>

                <Text style={{ marginBottom: 48 }}>
                  Ne feledd, hogy közeleg az időpontod a Botanic Beauty-ban!
                  Szeretettel várunk téged{' '}
                  <b>
                    {booking.selectedDate} {booking.selectedTimeSlot}
                  </b>{' '}
                  -kor.
                </Text>

                <Text>
                  Ha bármilyen kérdésed van, vagy változtatnál az időponton,
                  kérlek, vedd fel velünk a kapcsolatot e-mailben vagy
                  telefonon!
                </Text>
              </Column>
            </Row>

            <EmailFooter />
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

ReminderEmail.PreviewProps = {
  booking: {
    contactInfo: {
      name: 'Omamori Himari',
    },
    selectedDate: '2022-10-10',
    selectedTimeSlot: '10:00 - 11:00',
  },
} as ReminderEmailProps

export default ReminderEmail

const main = {
  backgroundColor: '#fff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const content = {
  border: '1px solid rgb(0,0,0, 0.1)',
  borderRadius: '3px',
  overflow: 'hidden',
}

const image = {
  maxWidth: '100%',
}

const boxInfos = {
  padding: '20px',
}
