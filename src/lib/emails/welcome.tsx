import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ThunderMailWelcomeEmailProps {
  username: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? `${process.env.NEXT_PUBLIC_BASE_URL}`
  : "";

export const ThunderMailWelcomeEmail = ({
  username,
}: ThunderMailWelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Start sending emails like it&apos;s a piece of cake.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          // src={`${baseUrl}/logo.png`}
          src="https://thundermail.vercel.app/logo.png"
          width="160"
          height="40"
          alt="Thunder Mail"
        />
        <Hr style={hr} />
        <Text style={paragraph}>Hi {username},</Text>
        <Text style={paragraph}>
          Welcome to Thunder Mail, the only email service you need for your side
          projects.
        </Text>
        <Text style={paragraph}>
          You can now setup your accout from the dashboard and start sending
          emails to your users from your app.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={`${baseUrl}/dashboard`}>
            View your Thunder Mail Dashboard
          </Button>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />
          The Thunder Mail team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          <Link href={`${baseUrl}`} style={link}>
            Thunder Mail
          </Link>{" "}
          | Your all in one email solution.
        </Text>
      </Container>
    </Body>
  </Html>
);

ThunderMailWelcomeEmail.PreviewProps = {
  username: "Alan",
} as ThunderMailWelcomeEmailProps;

export default ThunderMailWelcomeEmail;

const main = {
  backgroundColor: "#05050a",
  color: "#fafaf9",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#f0c142",
  borderRadius: "3px",
  color: "#422006",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const link = {
  color: "#f0c142",
};

const hr = {
  borderColor: "#666666",
  margin: "20px 0",
};

const footer = {
  color: "#a8a29e",
  fontSize: "12px",
};
