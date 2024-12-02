import React, { useRef, useState } from "react";
import { WrapperHeader } from "./style";
import {
  Button,
  Drawer,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
} from "antd";
import {
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  PercentageOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as ProductService from "../../Service/ProductService";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import * as message from "../../components/Message/Message";
import {
  converPrice,
  getBase64,
  renderOptions,
  truncateDescription,
} from "../../utils";
import Loading from "../LoadingComponent/LoadingComponent";

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [loadingDrawer, setLoadingDrawer] = useState(true);
  const user = useSelector((state) => state?.user);
  const [form] = Form.useForm();

  const initial = () => ({
    name: "",
    image: null,
    type: "",
    countInStock: "",
    price: "",
    rating: "",
    description: "",
    newType: "",
    discount: "",
  });

  const [stateProduct, setStateProduct] = useState(initial());
  const [stateProductDetails, setStateProductDetails] = useState(initial());

  //fnc call API createProduct
  const mutation = useMutationHooks((data) => {
    return ProductService.createProduct(data);
  });

  //fnc call API updateProduct
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct(id, token, {
      ...rests,
      discount: rests.discount,
    });
    return res;
  });

  //fnc call API deleteProduct
  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });

  //fnc getAllProduct from API
  const getAllProduct = async () => {
    const res = await ProductService.getAllProduct();
    return res;
  };

  //fnc type Product
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };

  const { data, isLoading, isSuccess, isError } = mutation;

  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  const {
    data: dataDeleted,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDelete;

  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllTypeProduct,
  });

  const queryProduct = useQuery({
    queryKey: ["product"],
    queryFn: getAllProduct,
  });

  const { isLoading: isLoadingProduct, data: products } = queryProduct;

  //fnc Cancel createProduct
  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct(initial());
    form.resetFields();
  };

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails(initial());
    form.resetFields();
  };

  //xử lý sự kiện khi thêm sản phẩm thành công
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();
      handleCancel();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess]);

  //Xử lý sự kiện khi update sản phẩm thành công
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated]);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  //Xử lý sự kiện khi delete sản phẩm thành công
  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDeleted]);

  const onClose = () => {
    setIsOpenDrawer(false);
  };

  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      image: stateProduct.image,
      type:
        stateProduct.type === "add_type"
          ? stateProduct.newType
          : stateProduct.type,
      countInStock: stateProduct.countInStock,
      price: stateProduct.price,
      rating: stateProduct.rating,
      description: stateProduct.description,
      discount: stateProduct.discount,
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };

  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteProduct = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleOnChangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (file && !file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file ? file.preview : null,
    });
  };

  //   const handleOnchangeAvatar = async ({ fileList }) => {
  //     const file = fileList[0];
  //     if (!file.url && !file.preview) {
  //       file.preview = await getBase64(file.originFileObj);
  //     }

  //     // Update the state for the product image
  //     setStateProduct({
  //       ...stateProduct,
  //       image: file.preview,
  //     });

  //     // Update the form with the new image value
  //     form.setFieldsValue({ image: file.preview });
  //   };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file ? file.preview : null,
    });
  };

  const onUpdateProducts = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateProductDetails,
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const fetchGetDetailsProduct = async () => {
    const res = await ProductService.getDetailsProduct(rowSelected);
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        image: res?.data?.image,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
        price: res?.data?.price,
        rating: res?.data?.rating,
        description: res?.data?.description,
        discount: res?.data?.discount,
      });
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateProductDetails);
    } else {
      form.setFieldsValue(initial());
    }
  }, [form, stateProductDetails, isModalOpen]);

  useEffect(() => {
    if (isOpenDrawer) {
      form.setFieldsValue(stateProductDetails);
    }
  }, [isOpenDrawer, stateProductDetails, form]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleDetailsProduct = () => {
    setLoadingDrawer(true);
    setIsOpenDrawer(true);
    setTimeout(() => {
      setLoadingDrawer(false);
    }, 1000);
  };

  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value,
    });
  };

  const handleChangeSelectDetails = (value) => {
    setStateProductDetails({
      ...stateProductDetails,
      type: value,
    });
  };

  const renderAction = () => {
    return (
      <div
        style={{
          fontSize: "20px",
          padding: "5px 5px",
          display: "flex",
          justifyContent: "space-evenly",
          cursor: "pointer",
        }}
      >
        <DeleteOutlined
          style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
          onClick={handleDetailsProduct}
        />
      </div>
    );
  };

  const columns = [
    {
      title: <div style={{ textAlign: "center" }}>Tên sản phẩm</div>,
      dataIndex: "name",
      width: "20%",
      responsive: ["lg"],
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: <div style={{ textAlign: "center" }}>Mô tả</div>,
      dataIndex: "description",
      width: "40%",
      responsive: ["lg"],
    },

    {
      title: <div style={{ textAlign: "center" }}>Giá sản phẩm</div>,
      dataIndex: "price",
      width: "10%",
      align: "center",
      responsive: ["md"],
    },
    {
      title: <div style={{ textAlign: "center" }}>Loại sản phẩm</div>,
      dataIndex: "type",
      align: "center",
      width: "10%",
      responsive: ["lg"],
    },

    {
      title: <div style={{ textAlign: "center" }}>Chức năng</div>,
      dataIndex: "Action",
      width: "10%",
      responsive: ["md"],
      render: renderAction,
    },
  ];

  //Hàm này chứa dữ liệu các món ăn trong bảng
  const dataTable =
    products?.data?.length &&
    products?.data?.map((product) => {
      return {
        ...product,
        key: product._id,
        price: converPrice(product.price),
        description: truncateDescription(product.description, 100),
        discount: product.discount,
      };
    });

  const openAddProductModal = () => {
    setStateProduct(initial());
    setIsModalOpen(true);
  };

  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
      <div style={{ marginTop: "10px" }}>
        <Button
          style={{
            height: "150px",
            width: "150px",
            borderRadius: "6px",
            borderStyle: "dashed",
          }}
          onClick={openAddProductModal}
        >
          <PlusOutlined style={{ fontSize: "60px" }} />
        </Button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Loading isLoading={isLoadingProduct}>
          <TableComponent
            columns={columns}
            isLoading={isLoadingProduct}
            pagination={{
              position: ["bottomCenter"],
              pageSize: 6,
            }}
            data={dataTable}
            onRow={(record) => ({
              onClick: () => setRowSelected(record._id),
            })}
          />
        </Loading>
      </div>
      <Modal
        title="Tạo sản phẩm"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          name="addFood"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="on"
          form={form}
          style={{
            maxWidth: "100%",
          }}
        >
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Please input your Name!" }]}
          >
            <InputComponent
              value={stateProduct.name}
              onChange={handleOnchange}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label="Phân loại "
            name="type"
            rules={[
              {
                required: true,
                message: "Hãy phân loại món ăn!",
              },
            ]}
          >
            <Select
              name="type"
              value={stateProduct.type}
              onChange={handleChangeSelect}
              options={renderOptions(typeProduct?.data?.data)}
            />
          </Form.Item>

          {stateProduct.type === "add_type" && (
            <Form.Item
              label="Thêm phân loại"
              name="newType"
              rules={[
                {
                  required: true,
                  message: "Hãy phân loại món ăn!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct.newType}
                onChange={handleOnchange}
                name="newType"
              />
            </Form.Item>
          )}

          <Form.Item
            label="Tồn kho"
            name="countInStock"
            rules={[
              {
                required: true,
                message: "Please input your number CountInStock!",
              },
            ]}
          >
            <InputComponent
              value={stateProduct.countInStock}
              onChange={handleOnchange}
              name="countInStock"
            />
          </Form.Item>
          <Form.Item
            label="Giá sản phẩm"
            name="price"
            rules={[{ required: true, message: "Please input your Price!" }]}
          >
            <InputNumber
              min={0}
              step={1000}
              prefix={<DollarOutlined />}
              value={stateProduct.price}
              formatter={(value) =>
                ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={(value) =>
                handleOnchange({ target: { name: "price", value } })
              }
              name="price"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            label="Đánh giá"
            name="rating"
            rules={[{ required: true, message: "Please input your Rating!" }]}
          >
            <InputComponent
              value={stateProduct.rating}
              onChange={handleOnchange}
              name="rating"
            />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: "Please input your Description!" },
            ]}
          >
            <InputComponent
              value={stateProduct.description}
              onChange={handleOnchange}
              name="description"
            />
          </Form.Item>

          <Form.Item
            label="Giảm giá"
            name="discount"
            rules={[
              { required: true, message: "Please input your Description!" },
            ]}
          >
            <InputNumber
              min={0}
              step={1000}
              prefix={<PercentageOutlined />}
              value={stateProduct.discount}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={(value) =>
                handleOnchange({ target: { name: "discount", value } })
              }
              name="discount"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Ảnh sản phẩm"
            name="image"
            rules={[
              {
                required: true,
                message: "Hãy thêm hình ảnh cho món ăn!",
              },
            ]}
          >
            <Upload
              maxCount={1}
              className="ant-upload-list-item-name"
              onChange={handleOnchangeAvatar}
              showUploadList={false}
              fileList={
                stateProduct?.image
                  ? [{ uid: "-1", url: stateProduct?.image }]
                  : []
              }
            >
              <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
            </Upload>
            {stateProduct?.image && (
              <Image
                src={stateProduct?.image}
                alt="Ảnh đại diện"
                style={{
                  height: "60px",
                  width: "60px",
                  marginLeft: "10px",
                  borderRadius: "10%",
                  objectFit: "cover",
                }}
              />
            )}
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",

                border: "none",
              }}
            >
              Thêm mới
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="Cập nhật sản phẩm"
        onClose={onClose}
        open={isOpenDrawer}
        loading={loadingDrawer}
        width="40%"
      >
        <Form
          isLoadingProduct={isLoadingProduct}
          name="updateProduct"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          style={{
            maxWidth: 600,
          }}
          onFinish={onUpdateProducts}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Please input your Name!" }]}
          >
            <InputComponent
              value={stateProductDetails.name}
              onChange={handleOnChangeDetails}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label="Phân loại "
            name="type"
            rules={[
              {
                required: true,
                message: "Hãy phân loại món ăn!",
              },
            ]}
          >
            <InputComponent
              size={50}
              value={stateProductDetails["type"]}
              onChange={handleOnChangeDetails}
              name="type"
            />
          </Form.Item>

          <Form.Item
            label="Tồn kho"
            name="countInStock"
            rules={[
              {
                required: true,
                message: "Please input your number CountInStock!",
              },
            ]}
          >
            <InputComponent
              value={stateProductDetails.countInStock}
              onChange={handleOnChangeDetails}
              name="countInStock"
            />
          </Form.Item>
          <Form.Item
            label="Giá sản phẩm"
            name="price"
            rules={[{ required: true, message: "Please input your Price!" }]}
          >
            <InputNumber
              min={0}
              step={1000}
              prefix={<DollarOutlined />}
              value={stateProductDetails.price}
              formatter={(value) =>
                ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={(value) =>
                handleOnChangeDetails({ target: { name: "price", value } })
              }
              name="price"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            label="Đánh giá"
            name="rating"
            rules={[{ required: true, message: "Please input your Rating!" }]}
          >
            <InputComponent
              value={stateProductDetails.rating}
              onChange={handleOnChangeDetails}
              name="rating"
            />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: "Please input your Description!" },
            ]}
          >
            <InputComponent
              value={stateProductDetails.description}
              onChange={handleOnChangeDetails}
              name="description"
            />
          </Form.Item>

          <Form.Item
            label="Giảm giá"
            name="discount"
            rules={[
              { required: true, message: "Please input your Description!" },
            ]}
          >
            <InputNumber
              min={0}
              step={1000}
              prefix={<PercentageOutlined />}
              value={stateProductDetails.discount}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={(value) =>
                handleOnChangeDetails({ target: { name: "discount", value } })
              }
              name="discount"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Ảnh sản phẩm"
            name="image"
            rules={[
              {
                required: true,
                message: "Hãy thêm hình ảnh cho món ăn!",
              },
            ]}
          >
            <Upload
              maxCount={1}
              className="ant-upload-list-item-name"
              onChange={handleOnchangeAvatarDetails}
              showUploadList={false}
              fileList={
                stateProductDetails?.image
                  ? [{ uid: "-1", url: stateProductDetails?.image }]
                  : []
              }
            >
              <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
            </Upload>
            {stateProductDetails?.image && (
              <Image
                src={stateProductDetails?.image}
                alt="Ảnh đại diện"
                style={{
                  height: "60px",
                  width: "60px",
                  marginLeft: "10px",
                  borderRadius: "10%",
                  objectFit: "cover",
                }}
              />
            )}
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 20, span: 20 }}>
            <Button type="primary" htmlType="submit" style={{ width: "90%" }}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        title="Xóa món ăn"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <div>Bạn có chắc xóa sản phẩm này không</div>
      </Modal>
    </div>
    // video 38: 20:42p
  );
};

export default AdminProduct;
