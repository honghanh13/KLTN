import React, { useEffect, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {
  WrapperButtonMore,
  WrapperProduct,
  WrapperProducts,
  WrapperTypeProduct,
} from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slider1 from "../../assets/images/slider1.jpg";
import slider2 from "../../assets/images/slider2.jpeg";
import slider3 from "../../assets/images/slider3.png";
import CardComponent from "../../components/CardComponent/CardComponent";
import * as ProductService from "../../Service/ProductService";
import { useQuery } from "@tanstack/react-query";
const HomePage = () => {
  const arr = ["TV", "Tu Lanh", "Lap Top"];
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(8);
  const [sort, setSort] = useState(null);
  const [filter, setFilter] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchGetAllProduct = async () => {
    const res = await ProductService.getAllProduct(page, limit, sort, filter);
    setTotalPages(res?.totalPage);
    return res;
  };

  //   useEffect(() => {
  //     fetchProducts();
  //   }, [page, limit, sort, filter]);

  const { isLoading, data: products } = useQuery({
    queryKey: ["products", page, limit, sort, filter],
    queryFn: () => fetchGetAllProduct(page, limit, sort, filter),
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });
  console.log("products", products);

  return (
    <>
      <div style={{ width: "1270px", margin: "0 auto" }}>
        <WrapperTypeProduct>
          {arr.map((item) => {
            return <TypeProduct name={item} key={item} />;
          })}
        </WrapperTypeProduct>
      </div>
      <div
        className="body"
        style={{ width: "100%", backgroundColor: "#efefef" }}
      >
        <div
          id="container"
          style={{ height: "1000px", width: "1270px", margin: "0 auto" }}
        >
          <SliderComponent arrImages={[slider1, slider2, slider3]} />
          <WrapperProducts>
            {isLoading ? (
              <h3>Loading...</h3>
            ) : (
              products?.data?.map((product) => (
                <CardComponent key={product.id} name={product?.name} rating={product?.rating} price={product?.price} discount={product?.discount} image={product?.image} selled={product?.selled} />
              ))
            )}
            {/* <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent /> */}
          </WrapperProducts>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <WrapperButtonMore
              textButton="Xem thêm"
              type="outline"
              styleButton={{
                border: "1px solid rgb(11, 116,229)",
                color: "rgb(11,116,229)",
                width: "240px",
                height: "38px",
                borderRadius: "4px",
              }}
              styleTextButton={{ fontWeight: 500 }}
            />
            {/* <NavBarComponent/> */}
          </div>
        </div>
      </div>
    </>
  );
};
export default HomePage;
