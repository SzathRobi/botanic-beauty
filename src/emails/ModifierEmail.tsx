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

interface ModifierEmailProps {
  booking: Booking;
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

                <Text style={{ marginBottom: 48 }}>
                  Az időpontodat módosítottuk a következőre:{" "}
                  <b>
                    {booking.selectedDate.split("T")[0]}{" "}
                    {booking.selectedTimeSlot}
                  </b>
                </Text>

                <Text>
                  Ha bármilyen kérdésed van, kérlek, vedd fel velünk a
                  kapcsolatot e-mailben vagy telefonon!
                </Text>
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
            </Link>{" "}
            | +36 30 178 5088
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

ModifierEmail.PreviewProps = {
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
} as ModifierEmailProps;

export default ModifierEmail;

const main = {
  backgroundColor: "#fff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
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
