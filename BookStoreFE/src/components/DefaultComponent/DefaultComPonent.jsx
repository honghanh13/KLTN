import React from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponet";
import FooterComponent from "../FooterComponent/FooterComponent";
  const DefaultComPonent = ({children}) => {
    return (
        <div>
          <HeaderComponent/>
          <div>{children}</div>
          <FooterComponent/>

        </div>
    )
  }
  export default DefaultComPonent