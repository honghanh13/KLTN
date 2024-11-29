import React from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponet";
import FooterComponent from "../FooterComponent/FooterComponent";
  const DefaultComPonent = ({children}) => {
    return (
        <div>
          <HeaderComponent/>
<<<<<<< Updated upstream
          <div>{children}</div>
=======
          {children}
          <FooterComponent/>
>>>>>>> Stashed changes
        </div>
    )
  }
  export default DefaultComPonent