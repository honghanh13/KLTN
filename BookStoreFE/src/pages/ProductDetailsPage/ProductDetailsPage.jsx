import React, { useEffect, useState } from "react";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as ProductService from "../../Service/ProductService";
import { useQuery } from "@tanstack/react-query";

const ProductDetailsPage = () => {
  const { id } = useParams();
  

  return (
    <div
      style={{ padding: "0 120px", background: "#efefef", height: "1000px" }}
    >
      <ProductDetailsComponent
        id={id}
      />
    </div>
  );
};
export default ProductDetailsPage;
