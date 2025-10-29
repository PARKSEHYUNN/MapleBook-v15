// src/emails/VerifyEmail.tsx

import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Link,
  Preview,
} from "@react-email/components";

interface VerifyEmailProps {
  name: string;
  validationLink: string;
}

export default function VerifyEmail({
  name,
  validationLink,
}: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>MapleBook 회원가입 인증 이메일입니다.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>안녕하세요, {name}님!</Heading>
          <Text style={paragraph}>
            MapleBook에 가입해주셔서 감사합니다. 아래 버튼을 클릭하여 이메일
            주소를 인증하고 회원가입을 완료해주세요.
          </Text>
          <Button style={button} href={validationLink}>
            이메일 인증
          </Button>
          <Text style={paragraph}>
            버튼이 작동하지 않으면, 아래 링크를 복사하여 브라우저에
            붙혀넣으세요:
          </Text>
          <Link href={validationLink} style={link}>
            {validationLink}
          </Link>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const heading = {
  fontSize: "24px",
  color: "#333",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.5",
  color: "#555",
};

const button = {
  backgroundColor: "#ff6600",
  color: "#ffffff",
  padding: "12px 20px",
  textDecoration: "none",
  borderRadius: "5px",
  fontWeight: "bold",
  display: "inline-block",
  marginTop: "10px",
};

const link = {
  color: "#ff6600",
  textDecoration: "underline",
};
