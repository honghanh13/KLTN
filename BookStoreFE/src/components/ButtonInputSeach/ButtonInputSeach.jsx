import React, { useState, useRef, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import * as ProductService from "../../Service/ProductService"
import { useNavigate } from "react-router-dom";
const ButtonInputSearch = (props) => {
  const {
    size,
    placeholder,
    textButton,
    bordered,
    backgroundColorInput = "#fff",
    backgroundColorButton = "rgb(13, 92, 182)",
    colorButton = "#fff",
  } = props;

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const handleSearch = async (value) => {
    if (value) {
      try {
        // Gọi API với filter
        const response = await ProductService.getAllProduct(0, 8, null, ["name", value]);
        setSearchResults(response.data || []); // Giả sử response trả về { products: [...] }
        setIsDropdownVisible(true); // Hiển thị dropdown
      } catch (error) {
        console.error("Error searching products:", error);
        setSearchResults([]);
        setIsDropdownVisible(false);
      }
    } else {
      setSearchResults([]);
      setIsDropdownVisible(false); // Ẩn dropdown nếu không có giá trị
    }
  };

  // Đóng dropdown khi click ra ngoài
  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <div style={{ display: "flex" }}>
        <InputComponent
          size={size}
          placeholder={placeholder}
          bordered={bordered}
          style={{ backgroundColor: backgroundColorInput }}
          onChange={(e) => {
            const value = e.target.value;
            setSearchValue(value);
            handleSearch(value); // Tự động tìm kiếm khi người dùng nhập
          }}
          onFocus={() => setIsDropdownVisible(true)} // Hiển thị dropdown khi focus
        />
        <ButtonComponent
          size={size}
          styleButton={{ background: backgroundColorButton, border: !bordered && "none" }}
          icon={<SearchOutlined color={colorButton} style={{ color: "#fff" }} />}
          textButton={textButton}
          styleTextButton={{ color: colorButton }}
          onClick={() => handleSearch(searchValue)} // Nút tìm kiếm vẫn hoạt động
        />
      </div>
      {/* Search Results */}
      {isDropdownVisible && searchResults.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "5px",
            marginTop: "8px",
            zIndex: 10,
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {searchResults.map((product) => (
            <div
              key={product._id}
              style={{
                display: "flex",
                padding: "10px",
                borderBottom: "1px solid #f0f0f0",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                setIsDropdownVisible(false); // Ẩn dropdown
                navigate(`/product-details/${product._id}`); // Điều hướng
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ width: "50px", height: "50px", borderRadius: "5px", marginRight: "10px" }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold", fontSize: "14px" }}>{product.name}</div>
                <div style={{ color: "green", fontSize: "12px" }}>{product.price}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ButtonInputSearch;
