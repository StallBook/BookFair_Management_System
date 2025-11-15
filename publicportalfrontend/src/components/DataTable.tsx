import { useEffect, useState } from "react";
import { Table, Divider, Tooltip, Modal, Form, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  deleteGenreService,
  updateGenreService,
} from "../services/AddGenre";
import { toast } from "react-toastify";

interface DataType {
  key: string;
  name: string;
  description: string;
  _id: string;
}

export default function DataTable({
  fetchData,
  genreDetails,
}: {
  fetchData: () => Promise<void>;
  genreDetails: DataType[];
}) {
  useEffect(() => {
    fetchData();
  }, []);
  const userID = localStorage.getItem("userID");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null);
  const [form] = Form.useForm();

  const handleDelete = async (userID: number, genreID: string) => {
    try {
      console.log(genreID);
      console.log("fuserID", userID);
      const response = await deleteGenreService(userID, genreID);
      console.log("Delete Genre Response:", response);
      if (response.message === "success") {
        toast.success("Genre deleted successfully");
        await fetchData();
      } else {
        toast.error("Failed to delete genre");
      }
    } catch (error) {
      toast.error("An unexpected error occurred while deleting genre");
    }
  };
  const openEditModal = (record: DataType) => {
    setEditingRecord(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSave = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        userID: Number(userID),
        genreID: editingRecord!._id,
        genreData: {
          name: values.name,
          description: values.description,
        },
      };

      const response = await updateGenreService(payload);

      if (response?.message === "success") {
        toast.success("Genre updated successfully");
        setIsEditModalOpen(false);
        fetchData();
      } else {
        toast.error("Failed to update genre");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "33.33%",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "33.33%",
    },
    {
      title: "Action",
      key: "action",
      width: "33.33%",
      render: (_, record: DataType) => {
        console.log("Delete", record);
        return (
          <>
            <Tooltip title={`Edit ${record.name}`}>
              <EditOutlined
                style={{ color: "#1890ff", cursor: "pointer", marginRight: 8 }}
                onClick={() => openEditModal(record)}
              />
            </Tooltip>
            <Divider type="vertical" />

            <Tooltip title="Delete">
              <DeleteOutlined
                style={{ color: "red", cursor: "pointer" }}
                onClick={() => handleDelete(Number(userID), record._id)}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];
  console.log("Genre Details in DataTable:", genreDetails);

  return (
    <>
      {" "}
      <Table
        columns={columns}
        dataSource={genreDetails}
        pagination={{ pageSize: 10 }}
        rowKey="key"
        scroll={{ x: "100%" }}
        style={{ tableLayout: "fixed" }}
        components={{
          header: {
            cell: (props: any) => (
              <th
                {...props}
                style={{ backgroundColor: "#000080", color: "#ffffff" }}
              >
                {props.children}
              </th>
            ),
          },
        }}
      />
      <Modal
        title="Edit Genre"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleEditSave}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter genre name" }]}
          >
            <Input placeholder="Enter genre name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea placeholder="Enter description" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
