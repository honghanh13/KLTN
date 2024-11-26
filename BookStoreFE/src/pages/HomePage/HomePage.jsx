import React, { useEffect, useRef, useState } from "react";
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

const HomePage = () => {
  const [listType, setListType] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(1);
  const [sort, setSort] = useState(null);
  const [filter, setFilter] = useState(["type", ""]);
  const [totalPages, setTotalPages] = useState(0);
  // const searchProduct = useSelector((state) => state?.product.search);
  // const searchDebounce = useDebounce(searchProduct, 1000);
  const refSearch = useRef();
  const [stateProducts, setStateProducts] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const search = "";

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setListType(res?.data);
    }
  };
  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const res = await ProductService.getAllProduct(page, limit, sort, filter);
      if (page === 0) {
        setStateProducts(res?.data || []); // Khởi tạo dữ liệu
        setTotalPages(Math.ceil(res?.total / limit)); // Cập nhật totalPages
      }
      setIsLoading(false);
    };
    fetchProducts();
  }, [page, limit, sort, filter]);

  const handleLoadMore = async () => {
    setIsLoading(true); // Bắt đầu tải
    const nextPage = page + 1;
    setPage(nextPage);

    const res = await ProductService.getAllProduct(
      nextPage,
      limit,
      sort,
      filter
    );

    setStateProducts((prevProducts) => [
      ...(prevProducts || []),
      ...(res?.data || []),
    ]);
    setIsLoading(false); // Kết thúc tải
  };

  const handleTypeSelect = async (type) => {
    setSelectedType(type);
    setPage(0);
    setFilter(["type", type.toString()]);
    setIsLoading(true);

    const res = await ProductService.getAllProduct(0, limit, sort, filter);
    setStateProducts(res?.data || []);
    setTotalPages(Math.ceil(res?.total / limit));
    setIsLoading(false);
  };

  const handleSetTypeAll = () => {
    setSelectedType(null);
    setPage(0);
    setFilter(["type", ""]);
    setIsLoading(true);
  };

  return (
    <>
      <div style={{ width: "1270px", margin: "0 auto", padding: 15 }}>
        <span
          style={{ padding: "0 10px", cursor: "pointer", fontSize: "14px" }}
          onClick={handleSetTypeAll}
        >
          Tất cả
        </span>
        {listType.map((item) => {
          return (
            <span
              style={{ padding: "0 10px", cursor: "pointer", fontSize: "14px" }}
              onClick={() => handleTypeSelect(item)}
            >
              {item}
            </span>
          );
        })}
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
              stateProducts?.map((product) => (
                <CardComponent
                  key={product?._id}
                  id={product?._id}
                  name={product?.name}
                  rating={product?.rating}
                  price={product?.price}
                  discount={product?.discount}
                  image={product?.image}
                  selled={product?.selled}
                />
              ))
            )}
          </WrapperProducts>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            {page + 1 < totalPages && (
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
                onClick={handleLoadMore}
              />
            )}
            {/* <NavBarComponent/> */}
          </div>
        </div>
      </div>
    </>
  );
};
export default HomePage;
