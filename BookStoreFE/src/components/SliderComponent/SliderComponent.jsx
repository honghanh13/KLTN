import { Image } from "antd";
import React from "react"
import { WapperSliderStyle } from "./style";

  const SliderComponent = ({arrImages}) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed:5000

      };
    return (
        <WapperSliderStyle {...settings}>
            {arrImages.map((image) =>{
                return(
                    <Image src={image} alt= "slider" preview={false} width="100%" height="274px"/>
                )
            })}

        </WapperSliderStyle>
    )
  }
  export default SliderComponent