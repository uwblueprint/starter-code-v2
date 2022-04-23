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
import { gql, useApolloClient, useQuery } from "@apollo/client";

import { SimpleEntityResponse } from "../../APIClients/SimpleEntityAPIClient";
// } graphql
// rest {
import SimpleEntityAPIClient, {
  SimpleEntityResponse,
} from "../../APIClients/SimpleEntityAPIClient";
// } rest
import { downloadCSV } from "../../utils/CSVUtils";

type EntityData = Omit<SimpleEntityResponse, "boolField"> & {
  boolField: string;
};

const convert = (entityResponse: SimpleEntityResponse): EntityData => {
  return {
    id: entityResponse.id,
    stringField: entityResponse.stringField,
    intField: entityResponse.intField,
    stringArrayField: entityResponse.stringArrayField,
    enumField: entityResponse.enumField,
    boolField: entityResponse.boolField.toString(),
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

const SimpleEntityDisplayTable = ({ data }: TableProps) => {
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
const SIMPLE_ENTITIES = gql`
  query SimpleEntityDisplayTableContainer_SimpleEntities {
    simpleEntities {
      id
      stringField
      intField
      enumField
      stringArrayField
      boolField
    }
  }
`;

const SIMPLE_ENTITIESCSV = gql`
  query SimpleEntityDisplayTableContainer_SimpleEntitiesCSV {
    simpleEntitiesCSV
  }
`;

// } graphql
const SimpleEntityDisplayTableContainer: React.FC = (): React.ReactElement | null => {
  const [entities, setEntities] = useState<EntityData[] | null>(null);

  // graphql {
  const apolloClient = useApolloClient();

  useQuery(SIMPLE_ENTITIES, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setEntities(
        data.simpleEntities.map((d: SimpleEntityResponse) => convert(d)),
      );
    },
  });
  // } graphql
  // rest {
  useEffect(() => {
    const retrieveAndUpdateData = async () => {
      const result = await SimpleEntityAPIClient.get();
      if (result) {
        setEntities(result.map((r: SimpleEntityResponse) => convert(r)));
      }
    };
    retrieveAndUpdateData();
  }, []);
  // } rest

  const downloadEntitiesCSV = async () => {
    if (entities) {
      // graphql {
      const { data } = await apolloClient.query({
        query: SIMPLE_ENTITIESCSV,
      });
      downloadCSV(data.simpleEntitiesCSV, "export.csv");
      // } graphql
      // rest {
      const csvString = await SimpleEntityAPIClient.getCSV();
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
      {entities && <SimpleEntityDisplayTable data={entities} />}
    </>
  );
};

export default SimpleEntityDisplayTableContainer;
