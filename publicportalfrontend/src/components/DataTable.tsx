import  { useEffect } from "react";
import { Table, Divider, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface DataType {
  key: string;
  name: string;
  description: string;
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
      render: (_, record: DataType) => (
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
              onClick={() => console.log("Delete", record)}
            />
          </Tooltip>
        </>
      ),
    },
  ];

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
