import { useEffect, useState } from "react";
import { Table, Divider, Tooltip, Modal, Form, Input, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { deleteGenreService, updateGenreService } from "../services/AddGenre";
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
  genreTypes,
}: {
  fetchData: () => Promise<void>;
  genreDetails: DataType[];
  genreTypes: string[];
}) {
  useEffect(() => {
    fetchData();
  }, []);
  const userID = localStorage.getItem("userID");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null);
  const [isChanged, setIsChanged] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<DataType | null>(null);
  const [form] = Form.useForm();
  const openDeleteModal = (record: DataType) => {
    setDeletingRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRecord) return;

    try {
      const response = await deleteGenreService(
        Number(userID),
        deletingRecord._id
      );
      if (response.message === "success") {
        toast.success("Genre deleted successfully");
        await fetchData();
        setIsDeleteModalOpen(false);
        setDeletingRecord(null);
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
    setIsChanged(false);
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
      render: (text: string) => (text ? text : <i>-</i>),
    },
    {
      title: "Action",
      key: "action",
      width: "33.33%",
      render: (_, record: DataType) => {
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
                onClick={() => openDeleteModal(record)}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-4">
        <h2 className="text-[20px] font-bold text-blue-900">Manage Genres</h2>
        <p className="text-gray-500 mt-1">
          View, edit, or delete existing genres below.
        </p>
      </div>

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
        title={<span className="font-bold text-lg">Edit Genre</span>}
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleEditSave}
        okText="Save"
        okButtonProps={{ disabled: !isChanged }}
      >
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changed, allValues) => {
            if (!editingRecord) return;

            const changedSomething =
              allValues.name !== editingRecord.name ||
              allValues.description !== editingRecord.description;

            setIsChanged(changedSomething);
          }}
        >
          <Form.Item
            name="name"
            label="Genre Name"
            rules={[{ required: true, message: "Please select a genre" }]}
          >
            <Select
              placeholder="Select a Genre"
              className="w-full"
              showSearch
              optionFilterProp="children"
            >
              {(genreTypes || []).map((genre: string, index: number) => (
                <Select.Option key={index} value={genre}>
                  {genre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Enter description" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={<span className="font-bold text-lg">Delete Genre</span>}
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={handleDeleteConfirm}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        <div style={{ padding: "10px 0" }}>
          <p>
            Are you sure you want to delete the following genre?
            <span style={{ fontWeight: "bold", color: "red" }}>
              {" "}
              This action cannot be undone!
            </span>
          </p>

          {deletingRecord && (
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
                marginTop: 10,
                backgroundColor: "#f9f9f9",
              }}
            >
              <p>
                <b>Name:</b> {deletingRecord.name}
              </p>
              <p>
                <b>Description:</b>{" "}
                {deletingRecord.description || "No description"}
              </p>
            </div>
          )}

          <p style={{ marginTop: 10, color: "red", fontWeight: "bold" }}>
            ⚠ Warning: Deleting this genre will remove it permanently from the
            system.
          </p>
        </div>
      </Modal>
    </>
  );
}
