import { useEffect } from "react";
import { Table, Divider, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { deleteGenreService } from "../services/AddGenre";
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
  const handleDelete = async (userID: number, genreID: string) => {
    try {
      console.log(genreID)
      console.log("fuserID", userID)
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
                onClick={() => console.log("Edit", record)}
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
  );
}
