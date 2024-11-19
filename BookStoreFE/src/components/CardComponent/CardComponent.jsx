import React from "react";
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperImageStyle, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from "./Style";
import {StarFilled } from "@ant-design/icons";
import {logo} from '../../assets/images/logo.webp';

const CardComponent = () => {
  return (
    <WrapperCardStyle
        hoverable
        headStyle={{width: '200px', height: '200px'}}
        style={{ width: 240 }}
        bodyStyle={{padding:'10px'}}
        cover={<img alt="example"src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>}
    >


        {/* <WrapperImageStyle src={logo} /> */}
        <img src={require("../../assets/images/logo.webp")} alt="cart" style ={{width:'72px', height:'20px', position:'absolute', top:-1, left:-1, borderTopLeftRadius: '3px'}}/>
        <StyleNameProduct>Văn phòng phẩm</StyleNameProduct>
        <WrapperReportText>
          <span style={{marginRight: '4px'}}>
              <span>4.5</span><StarFilled style={{fontSize:'12px', color:'yellow'}} />
          </span>
          <WrapperStyleTextSell> | Đã bán 1000+</WrapperStyleTextSell>
          </WrapperReportText>
          <WrapperPriceText>
            <span style={{marginRight:'8px'}}>1.000.000</span>
            <WrapperDiscountText>
              -5%
            </WrapperDiscountText>
          </WrapperPriceText>
    </WrapperCardStyle>
  );
};
export default CardComponent;
