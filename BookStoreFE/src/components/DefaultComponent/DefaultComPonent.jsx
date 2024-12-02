import React from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponet";
import FooterComponent from "../FooterComponent/FooterComponent";
import styled from "styled-components";

const LayoutContainer = styled.div`
  display: block;
  min-height: 100vh; /* Đảm bảo bố cục chiếm toàn bộ chiều cao màn hình */
`;

const ContentContainer = styled.div`
  padding: 20px; /* Khoảng cách nội dung */
`;

const DefaultComPonent = ({ children }) => {
  return (
    <LayoutContainer>
      <HeaderComponent />
      <ContentContainer>{children}</ContentContainer>
      <FooterComponent />
    </LayoutContainer>
  );
};

export default DefaultComPonent;
