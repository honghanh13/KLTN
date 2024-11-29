import React from "react";
import { Row, Col, Input, Button } from "antd";
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from "@ant-design/icons";
import styled from "styled-components";

const FooterContainer = styled.div`
  background-color: #f7f7f7;
  padding: 40px 20px;
  font-family: Arial, sans-serif;
  border-top: 1px solid #e5e5e5;
`;

const FooterTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
`;

const FooterText = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.6;
`;

const FooterLink = styled.a`
  display: block;
  color: #0073e6;
  font-size: 14px;
  margin-bottom: 8px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const SocialIcon = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  & img {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
`;

const NewsletterInput = styled(Input)`
  width: 70%;
  margin-right: 10px;
`;

const FooterComponent = () => {
  return (
    <FooterContainer>
      <Row gutter={[24, 24]}>
        {/* Section 1: About */}
        <Col span={8}>
          <FooterTitle>Văn Phòng Phẩm XYZ</FooterTitle>
          <FooterText>
            Chúng tôi cung cấp các sản phẩm văn phòng phẩm chất lượng cao, đảm bảo đáp ứng mọi nhu cầu
            của bạn. Hãy ghé thăm cửa hàng để khám phá thế giới dụng cụ học tập và văn phòng đa dạng.
          </FooterText>
          <SocialIcon>
            <img src="facebook-icon.png" alt="Facebook" />
            <img src="instagram-icon.png" alt="Instagram" />
            <img src="twitter-icon.png" alt="Twitter" />
          </SocialIcon>
        </Col>

        {/* Section 2: Quick Links */}
        <Col span={8}>
          <FooterTitle>Liên Kết Nhanh</FooterTitle>
          <FooterLink href="/products">Sản phẩm</FooterLink>
          <FooterLink href="/about">Về chúng tôi</FooterLink>
          <FooterLink href="/contact">Liên hệ</FooterLink>
          <FooterLink href="/faq">Câu hỏi thường gặp</FooterLink>
        </Col>

        {/* Section 3: Contact Information */}
        <Col span={8}>
          <FooterTitle>Liên Hệ</FooterTitle>
          <FooterText>
            <EnvironmentOutlined style={{ marginRight: "8px" }} />
            123 Đường ABC, Quận XYZ, TP.HCM
          </FooterText>
          <FooterText>
            <PhoneOutlined style={{ marginRight: "8px" }} />
            0123 456 789
          </FooterText>
          <FooterText>
            <MailOutlined style={{ marginRight: "8px" }} />
            support@vanphongpham.xyz
          </FooterText>
          <FooterTitle>Đăng ký nhận tin</FooterTitle>
          <div style={{ display: "flex", alignItems: "center" }}>
            <NewsletterInput placeholder="Nhập email của bạn" />
            <Button type="primary">Đăng ký</Button>
          </div>
        </Col>
      </Row>
      <div style={{ textAlign: "center", marginTop: "20px", color: "#999", fontSize: "12px" }}>
        © 2024 Văn Phòng Phẩm XYZ. Tất cả các quyền được bảo lưu.
      </div>
    </FooterContainer>
  );
};

export default FooterComponent;
