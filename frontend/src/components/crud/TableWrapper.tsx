/* eslint  react/jsx-props-no-spreading: 0 */ // --> OFF
import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import EntityAPIClient from "../../APIClients/EntityAPIClient";

enum EnumField {
  "A",
  "B",
  "C",
  "D",
}

type EntityResponse = {
  id: string | number;
  stringField: string;
  intField: number;
  stringArrayField: string[];
  enumField: EnumField;
  boolField: boolean;
};

type EntityData = {
  id: string | number;
  stringField: string;
  intField: number;
  stringArrayField: string[];
  enumField: EnumField;
  boolField: string;
};

const convert = (entityReponse: EntityResponse) => {
  return {
    id: entityReponse.id,
    stringField: entityReponse.stringField,
    intField: entityReponse.intField,
    stringArrayField: entityReponse.stringArrayField,
    enumField: entityReponse.enumField,
    boolField: entityReponse.boolField.toString(),
  };
};

const GetTable = (props: any) => {
  const { data } = props;
  const columns = React.useMemo(
    () => [
      {
        Header: "stringField",

        accessor: "stringField", // accessor is the "key" in the data
      },

      {
        Header: "integerField",

        accessor: "intField",
      },
      {
        Header: "stringArrayField",

        accessor: "stringArrayField",
      },
      {
        Header: "enumField",

        accessor: "enumField",
      },
      {
        Header: "boolField",

        accessor: "boolField",
      },
    ],

    [],
  );

  const {
    getTableProps,

    getTableBodyProps,

    headerGroups,

    rows,

    prepareRow,
  } = useTable({ columns, data });

  return (
    <table
      {...getTableProps()}
      style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                style={{
                  borderBottom: "solid 3px red",

                  background: "aliceblue",

                  color: "black",

                  fontWeight: "bold",
                }}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);

          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: "10px",

                      border: "solid 1px gray",

                      background: "papayawhip",
                    }}
                  >
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const TableWrapper = () => {
  const [data, setData] = useState<EntityResponse[] | null>(null);
  let newData: EntityData[] | null = null;

  useEffect(() => {
    const retrieveAndUpdateData = async () => {
      const result = await EntityAPIClient.get();
      setData(result);
    };
    retrieveAndUpdateData();
  }, []);

  if (data) {
    newData = data.map((x: EntityResponse) => convert(x));
  }

  return newData && <GetTable data={newData} />;
};

export default TableWrapper;
