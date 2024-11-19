import React from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponet";
  const DefaultComPonent = ({children}) => {
    return (
        <div>
          <HeaderComponent/>
          {children}
        </div>
    )
  }
  export default DefaultComPonent