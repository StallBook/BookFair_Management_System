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
  const [form] = Form.useForm();

  const handleDelete = async (userID: number, genreID: string) => {
    try {
      const response = await deleteGenreService(userID, genreID);
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
                onClick={() => handleDelete(Number(userID), record._id)}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <>
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
    </>
  );
}
