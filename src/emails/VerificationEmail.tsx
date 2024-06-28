import { Booking } from "@prisma/client";
import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  booking: Booking;
}

export const VerificationEmail = ({ booking }: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Sikeres foglalás</Preview>
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

            <Row style={{ ...boxInfos, paddingBottom: "0" }}>
              <Column>
                <Heading
                  style={{
                    fontSize: 24,
                    fontWeight: "normal",
                    textAlign: "left",
                  }}
                >
                  Kedves {booking.contactInfo.name},
                </Heading>
                <Heading
                  as="h2"
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "left",
                    marginBottom: 48,
                  }}
                >
                  Köszönjük a foglalásod , sikeresen rögzítetük.
                </Heading>

                <Text style={paragraph}>Foglalás részletei:</Text>

                <Text>
                  Időpont:{" "}
                  <b>
                    {booking.selectedDate} {booking.selectedTimeSlot}
                  </b>
                </Text>

                <Text style={{ marginBottom: 48 }}>
                  Szolgáltatás: <b>{booking.service.name}</b>
                </Text>

                <Text style={paragraph}>
                  Ha mégse jó az időpont kérlek jelezd a következő emailen /
                  telefonon:
                </Text>
                <Text>botanic.beauty.salon@gmail.com / +36 30 178 5088</Text>
              </Column>
            </Row>
          </Section>

          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "rgb(0,0,0, 0.7)",
            }}
          >
            © 2024 | Botanic Beauty Hajszalon, 1045, Budapest, Széchenyi tér 4.
            |{" "}
            <Link href="https://www.botanic-beauty.hu">
              www.botanic-beauty.hu
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

VerificationEmail.PreviewProps = {
  booking: {
    contactInfo: {
      name: "Omamori Himari",
    },
    service: {
      name: "Tőfestés",
    },
    selectedDate: "2022-10-10",
    selectedTimeSlot: "10:00 - 11:00",
  },
} as VerificationEmailProps;

export default VerificationEmail;

const main = {
  backgroundColor: "#fff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const paragraph = {
  fontSize: 16,
};

const content = {
  border: "1px solid rgb(0,0,0, 0.1)",
  borderRadius: "3px",
  overflow: "hidden",
};

const image = {
  maxWidth: "100%",
};

const boxInfos = {
  padding: "20px",
};
