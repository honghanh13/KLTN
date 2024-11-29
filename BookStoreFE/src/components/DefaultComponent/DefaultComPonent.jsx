import React from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponet";
  const DefaultComPonent = ({children}) => {
    return (
        <div>
          <HeaderComponent/>
          <div>{children}</div>
        </div>
    )
  }
  export default DefaultComPonent