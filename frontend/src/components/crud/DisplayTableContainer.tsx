/* eslint  react/jsx-props-no-spreading: 0 */ // --> OFF
// graphql {
import React, { useState } from "react";
// } graphql
// rest {
import React, { useState, useEffect } from "react";
// } rest
import BTable from "react-bootstrap/Table";
import { HeaderGroup, useTable, Column } from "react-table";
// graphql {
import { gql, useQuery, useLazyQuery } from "@apollo/client";

import { EntityResponse } from "../../APIClients/EntityAPIClient";
// } graphql
// rest {

import EntityAPIClient, {
  EntityResponse,
} from "../../APIClients/EntityAPIClient";
// } rest
import { downloadCSV } from "../../utils/CSVUtils";

type EntityData = Omit<EntityResponse, "boolField"> & { boolField: string };

const convert = (entityReponse: EntityResponse): EntityData => {
  return {
    id: entityReponse.id,
    stringField: entityReponse.stringField,
    intField: entityReponse.intField,
    stringArrayField: entityReponse.stringArrayField,
    enumField: entityReponse.enumField,
    boolField: entityReponse.boolField.toString(),
  };
};

type TableProps = {
  data: EntityData[];
};

const columns: Column<EntityData>[] = [
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
];

const DisplayTable = ({ data }: TableProps) => {
  const {
    getTableProps,

    headerGroups,

    rows,

    prepareRow,
  } = useTable<EntityData>({ columns, data });

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
    }
  }
`;

const ENTITIESCSV = gql`
  query DisplayTableContainer_EntitiesCSV {
    entitiesCSV
  }
`;

// } graphql
const DisplayTableContainer: React.FC = (): React.ReactElement | null => {
  const [entities, setEntities] = useState<EntityData[] | null>(null);

  // graphql {
  useQuery(ENTITIES, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setEntities(data.entities.map((d: EntityResponse) => convert(d)));
    },
  });

  const [getEntitiesCSV] = useLazyQuery(ENTITIESCSV, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      downloadCSV(data.entitiesCSV, "export.csv");
    },
  });
  // } graphql
  // rest {
  useEffect(() => {
    const retrieveAndUpdateData = async () => {
      const result = await EntityAPIClient.get();
      if (result) {
        setEntities(result.map((r: EntityResponse) => convert(r)));
      }
    };
    retrieveAndUpdateData();
  }, []);
  // } rest

  const downloadEntitiesCSV = async () => {
    if (entities) {
      // graphql {
      getEntitiesCSV();
      // } graphql
      // rest {
      const csvString = await EntityAPIClient.getCSV();
      downloadCSV(csvString, "export.csv");
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
      {entities && <DisplayTable data={entities} />}
    </>
  );
};

export default DisplayTableContainer;
