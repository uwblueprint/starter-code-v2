/* eslint  react/jsx-props-no-spreading: 0 */ // --> OFF
// graphql {
import React, { useState } from "react";
// } graphql
// rest {
// import React, { useState, useEffect } from "react";
// } rest
import BTable from "react-bootstrap/Table";
import { HeaderGroup, useTable, Column } from "react-table";

// graphql {
import { gql, useApolloClient, useQuery } from "@apollo/client";

import { EntityResponse } from "../../APIClients/EntityAPIClient";
// } graphql
import { downloadFile } from "../../utils/FileUtils";
// rest {

// import EntityAPIClient, {
//   EntityResponse,
// } from "../../APIClients/EntityAPIClient";
// } rest
import { downloadCSV } from "../../utils/CSVUtils";

type EntityData = Omit<EntityResponse, "boolField"> & { boolField: string };

const convert = (entityResponse: EntityResponse): EntityData => {
  return {
    id: entityResponse.id,
    stringField: entityResponse.stringField,
    intField: entityResponse.intField,
    stringArrayField: entityResponse.stringArrayField,
    enumField: entityResponse.enumField,
    boolField: entityResponse.boolField.toString(),
    fileName: entityResponse.fileName,
  };
};

type TableProps = {
  data: EntityData[];
  downloadEntityFile: any;
};

const createColumns = (downloadEntityFile: any): Column<EntityData>[] => [
  {
    Header: "id",

    accessor: "id", // accessor is the "key" in the data
  },
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
  {
    Header: "fileName",

    accessor: "fileName",

    // eslint-disable-next-line react/display-name
    Cell: ({ cell }: any) =>
      cell.row.values.fileName ? (
        <button
          type="button"
          onClick={() => downloadEntityFile(cell.row.values.fileName)}
        >
          Download
        </button>
      ) : null,
  },
];

const DisplayTable = ({ data, downloadEntityFile }: TableProps) => {
  const {
    getTableProps,

    headerGroups,

    rows,

    prepareRow,
  } = useTable<EntityData>({
    columns: createColumns(downloadEntityFile),
    data,
  });

  return (
    <BTable
      striped
      bordered
      hover
      size="sm"
      {...getTableProps()}
      style={{ marginTop: "20px" }}
    >
      <thead>
        {headerGroups.map((headerGroup: HeaderGroup<EntityData>) => (
          // Key is specified in the prop getter functions
          // eslint-disable-next-line react/jsx-key
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              // eslint-disable-next-line react/jsx-key
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {rows.map((row) => {
          prepareRow(row);
          return (
            // eslint-disable-next-line react/jsx-key
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                // eslint-disable-next-line react/jsx-key
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </BTable>
  );
};

// graphql {
const ENTITIES = gql`
  query DisplayTableContainer_Entities {
    entities {
      id
      stringField
      intField
      enumField
      stringArrayField
      boolField
      fileName
    }
  }
`;

const ENTITIESCSV = gql`
  query DisplayTableContainer_EntitiesCSV {
    entitiesCSV
  }
`;

const FILE = gql`
  query DisplayTableContainer_File($fileUUID: ID!) {
    file(fileUUID: $fileUUID)
  }
`;
// } graphql

const DisplayTableContainer: React.FC = (): React.ReactElement | null => {
  const [entities, setEntities] = useState<EntityData[] | null>(null);

  // graphql {
  const apolloClient = useApolloClient();
  // } graphql

  useQuery(ENTITIES, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setEntities(data.entities.map((d: EntityResponse) => convert(d)));
    },
  });

  // rest {
  // useEffect(() => {
  //   const retrieveAndUpdateData = async () => {
  //     const result = await EntityAPIClient.get();
  //     if (result) {
  //       setData(result.map((r: EntityResponse) => convert(r)));
  //     }
  //   };
  //   retrieveAndUpdateData();
  // }, []);
  // } rest

  const downloadEntityFile = async (fileUUID: string) => {
    // graphql {
    const { data } = await apolloClient.query({
      query: FILE,
      variables: { fileUUID },
    });
    downloadFile(data.file, "file");
    // } graphql

    // rest {
    // const data = await EntityAPIClient.getFile(fileUUID);
    // downloadFile(data, "file");
    // } rest
  };

  const downloadEntitiesCSV = async () => {
    if (entities) {
      // graphql {
      const { data } = await apolloClient.query({
        query: ENTITIESCSV,
      });
      downloadCSV(data.entitiesCSV, "export.csv");
      // } graphql
      // rest {
      // const csvString = await EntityAPIClient.getCSV();
      // downloadCSV(csvString, "export.csv");
      // } rest
      // Use the following lines to download CSV using frontend CSV generation instead of API
      // const csvString = await generateCSV<EntityData>({ data: entities });
      // downloadCSV(csvString, "export.csv");
    }
  };

  return (
    <>
      <button type="button" onClick={downloadEntitiesCSV}>
        Download CSV
      </button>
      {entities && <DisplayTable data={entities} downloadEntityFile={downloadEntityFile} />}
    </>
  );
};

export default DisplayTableContainer;
