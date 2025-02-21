import { Booking } from '@prisma/client'
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

import { CONTACT_ADDRESS, CONTACT_PHONE } from '@/constants/contact.constants'

interface ModifierEmailProps {
  booking: Booking
}

export const ModifierEmail = ({ booking }: ModifierEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Foglalás módosulása</Preview>
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
                  Az időpontodat módosítottuk a következőre:
                  <br />
                  Szolgáltalás: <b>{booking.service.name}</b>
                  <br />
                  Időpont:{' '}
                  <b>
                    {booking.selectedDate.split('T')[0]}{' '}
                    {booking.selectedTimeSlot}
                  </b>
                </Text>

                <Text>
                  Ha bármilyen kérdésed van, kérlek, vedd fel velünk a
                  kapcsolatot e-mailben vagy telefonon!
                </Text>
              </Column>
            </Row>

            <Text
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: 'rgb(0,0,0, 0.7)',
              }}
            >
              Botanic Beauty Szalon, {CONTACT_ADDRESS}|{' '}
              <Link href="https://www.botanic-beauty.hu">
                www.botanic-beauty.hu
              </Link>{' '}
              | {CONTACT_PHONE}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

ModifierEmail.PreviewProps = {
  booking: {
    contactInfo: {
      name: 'Omamori Himari',
    },
    selectedDate: '2022-10-10',
    selectedTimeSlot: '10:00 - 11:00',
  },
} as ModifierEmailProps

export default ModifierEmail

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
