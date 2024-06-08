import { Booking } from "@prisma/client";
import {
  Body,
  Button,
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
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  booking: Booking;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const VerificationEmail = ({ booking }: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Sikeres foglalás</Preview>
      <Body style={main}>
        <Container>
          <Section style={content}>
            <Row>
              {/* TODO: img url csere */}
              <Img
                style={image}
                width={620}
                src="https://images.unsplash.com/photo-1498735599329-ed6e3798cdcb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              />
            </Row>

            <Row style={{ ...boxInfos, paddingBottom: "0" }}>
              <Column>
                <Heading
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Hi {booking.contactInfo.name},
                </Heading>
                <Heading
                  as="h2"
                  style={{
                    fontSize: 26,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  We noticed a recent login to your Yelp account.
                </Heading>

                <Text style={paragraph}>
                  <b>Szolgáltatás</b>
                </Text>

                {booking.services.map((service, index: number) => (
                  <Text key={index}>{service.name}</Text>
                ))}
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>Időpont: </b>
                  {booking.selectedDate} {booking.selectedTimeSlot}
                </Text>
              </Column>
            </Row>
            <Row style={{ ...boxInfos, paddingTop: "0" }}>
              <Column style={containerButton} colSpan={2}>
                <Button style={button}>Learn More</Button>
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
            © 2022 | Yelp Inc., 350 Mission Street, San Francisco, CA 94105,
            U.S.A. | www.yelp.com
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
    services: [
      {
        name: "Haircut",
      },
    ],
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

const containerButton = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
};

const button = {
  backgroundColor: "#e00707",
  borderRadius: 3,
  color: "#FFF",
  fontWeight: "bold",
  border: "1px solid rgb(0,0,0, 0.1)",
  cursor: "pointer",
  padding: "12px 30px",
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
