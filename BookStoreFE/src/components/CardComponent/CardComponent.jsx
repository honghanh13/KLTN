import React from "react";
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperImageStyle, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from "./Style";
import {StarFilled } from "@ant-design/icons";
import {logo} from '../../assets/images/logo.webp';
import { useNavigate } from "react-router-dom";
import { converPrice } from "../../utils";

const CardComponent = ({id,name,rating,image,selled,price,discount}) => {

  const navigate = useNavigate();
 
 
  const discountedPrice =
  price * (1 - discount / 100);

  const handleDetailsProduct = (id) => {
    navigate(`/product-details/${id}`);
  };

  return (
    <WrapperCardStyle
    onClick={() => handleDetailsProduct(id)}
        hoverable
        headStyle={{width: '200px', height: '200px'}}
        style={{ width: 240 }}
        bodyStyle={{padding:'10px'}}
        cover={<img alt="example"src={image}/>}
    >


        {/* <WrapperImageStyle src={logo} /> */}
        <img src={require("../../assets/images/logo.webp")} alt="cart" style ={{width:'72px', height:'20px', position:'absolute', top:-1, left:-1, borderTopLeftRadius: '3px'}}/>
        <StyleNameProduct>{name}</StyleNameProduct>
        <WrapperReportText>
          <span style={{marginRight: '4px'}}>
              <span>{rating}</span><StarFilled style={{fontSize:'12px', color:'yellow'}} />
          </span>
          <WrapperStyleTextSell> | Đã bán {selled}+</WrapperStyleTextSell>
          </WrapperReportText>
          <WrapperPriceText>
            <span style={{marginRight:'8px'}}>{converPrice(discountedPrice)}</span>
            <WrapperDiscountText>
              -{discount}%
            </WrapperDiscountText>
          </WrapperPriceText>
    </WrapperCardStyle>
  );
};
export default CardComponent;
