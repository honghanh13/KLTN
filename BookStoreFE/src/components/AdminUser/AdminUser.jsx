import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader } from "./style";
import {
  Button,
  Drawer,
  Form,
  Modal,
  Space,
  Switch,
  Typography,
  Upload,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../Service/UserService";
import { useIsFetching, useQuery, useQueryClient } from "@tanstack/react-query";
import * as message from "../../components/Message/Message";
import { getBase64, truncateDescription } from "../../utils";
import Loading from "../LoadingComponent/LoadingComponent";
import InputComponent from "../InputComponent/InputComponent";

const AdminUser = () => {
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [loadingDrawer, setLoadingDrawer] = useState(true);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [setIsModalOpen] = useState(false);
  const user = useSelector((state) => state?.user);
  const [form] = Form.useForm();

  const [isAdmin, setIsAdmin] = useState(false);

  const initial = () => ({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
    phone: "",
    address: "",
  });

  const [stateUser, setStateUser] = useState(initial());
  const [stateUserDetails, setStateUserDetails] = useState(initial());

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.UpdateUser(id, { ...rests }, token);
    return res;
  });

  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res = UserService.deleteUser(id, token);
    return res;
  });

  const getAllUser = async () => {
    const res = await UserService.getAllUSer(user?.access_token);
    return res;
  };

  const {
    data: dataUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  const {
    data: dataDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDelete;

  const queryUser = useQuery({
    queryKey: ["users"],
    queryFn: getAllUser,
  });

  const { isLoading: isLoadingUser, data: users } = queryUser;

  //   const handleCancel = () => {
  //     setIsModalOpen(false);
  //     setStateUser(initial());
  //     form.resetFields();
  //   }

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDeleted, dataDeleted?.status, isErrorDeleted]);

  const onClose = () => {
    setIsOpenDrawer(false);
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteUser = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const onUpdateUser = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateUserDetails,
        isAdmin, //Thêm isAdmin vào đây để được update trạng thái
      },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  const fetchgetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected);
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        password: res?.data?.password,
        isAdmin: res?.data?.isAdmin,
        phone: res?.data?.phone,
        address: res?.data?.address,
      });
      setIsAdmin(res?.data?.isAdmin); // Cập nhật isAdmin từ dữ liệu lấy về
    }
    // setIsLoadingUpdate(false);
  };

  useEffect(() => {
    if (isOpenDrawer) {
      form.setFieldsValue(stateUserDetails); // Set form values when the drawer opens
      setIsAdmin(stateUserDetails.isAdmin); // Cập nhật trạng thái isAdmin từ stateUser Details
    }
  }, [isOpenDrawer, stateUserDetails, form]);

  const handleSwitchChange = (checked) => {
    setIsAdmin(checked);
    setStateUserDetails((prevState) => ({
      ...prevState,
      isAdmin: checked, // Cập nhật isAdmin vào stateUser Details
    }));
  };

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchgetDetailsUser(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleDetailsUser = () => {
    setLoadingDrawer(true);
    setIsOpenDrawer(true);
    setTimeout(() => {
      setLoadingDrawer(false);
    }, 1000);
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
          onClick={handleDetailsUser}
        />
      </div>
    );
  };

  const columns = [
    {
      title: <div style={{ textAlign: "center" }}>Họ và tên</div>,
      dataIndex: "name",
      width: "30%",
      responsive: ["lg"],
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: <div style={{ textAlign: "center" }}>Email</div>,
      dataIndex: "email",
      width: "20%",
      responsive: ["md"],
    },

    {
      title: <div style={{ textAlign: "center" }}>Quyền</div>,
      dataIndex: "isAdmin",
      width: "20%",
      align: "center",
      responsive: ["md"],
    },

    {
      title: <div style={{ textAlign: "center" }}>Điện thoại</div>,
      dataIndex: "phone",
      align: "center",
      width: "10%",
      responsive: ["lg"],
      // sorter: (a, b) => a.LoaiMonAn - b.LoaiMonAn,
    },

    {
      title: <div style={{ textAlign: "center" }}>Chức năng</div>,
      dataIndex: "Action",
      width: "10%",
      responsive: ["md"],
      render: renderAction,
    },
  ];

  const dataTable =
    users?.data?.length &&
    users?.data?.map((user) => {
      return {
        ...user,
        key: user._id,
        isAdmin: user.isAdmin ? "Admin" : "User",
        password: truncateDescription(user.password, 100),
      };
    });

  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>

      <div style={{ marginTop: "20px" }}>
        <Loading isLoading={isLoadingUser}>
          <TableComponent
            columns={columns}
            isLoading={isLoadingUser}
            pagination={{
              position: ["bottomCenter"],
              pageSize: 6,
            }}
            data={dataTable}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setRowSelected(record._id);
                },
              };
            }}
          />
        </Loading>

        <Drawer
          forceRender
          title="Cập nhật người dùng"
          onClose={onClose}
          open={isOpenDrawer}
          loading={loadingDrawer}
          width="40%"
        >
          <Loading isLoading={isLoadingUser}>
            <Form
              form={form}
              name="updateUser"
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
              style={{
                maxWidth: 600,
              }}
              onFinish={onUpdateUser}
              autoComplete="on"
            >
              <Form.Item
                label="Họ tên"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập họ tên!",
                  },
                ]}
              >
                <InputComponent
                  value={stateUserDetails.name}
                  onChange={handleOnchangeDetails}
                  name="name"
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập Email!",
                  },
                ]}
              >
                <InputComponent
                  rows={4}
                  value={stateUserDetails.email}
                  onChange={handleOnchangeDetails}
                  name="email"
                />
              </Form.Item>

              <Form.Item
                label="Điện thoại"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập số điện thoại!",
                  },
                ]}
              >
                <InputComponent
                  value={stateUserDetails.phone}
                  onChange={handleOnchangeDetails}
                  name="phone"
                />
              </Form.Item>

              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập địa chỉ!",
                  },
                ]}
              >
                <InputComponent
                  value={stateUserDetails.address}
                  onChange={handleOnchangeDetails}
                  name="address"
                />
              </Form.Item>

              <Form.Item label="Quyền">
                <Switch checked={isAdmin} onChange={handleSwitchChange} />
                <Typography.Text style={{ marginLeft: 8 }}>
                  {stateUserDetails.isAdmin ? "Admin" : "User "}
                </Typography.Text>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 20, span: 20 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "90%" }}
                >
                  Cập nhật
                </Button>
              </Form.Item>
            </Form>
          </Loading>
        </Drawer>

        <Modal
          title="Xóa người dùng"
          open={isModalOpenDelete}
          onCancel={handleCancelDelete}
          onOk={handleDeleteUser}
        >
          <div>
            Bạn có chắc xóa người dùng có họ tên là {stateUserDetails.name} này
            không
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminUser;
