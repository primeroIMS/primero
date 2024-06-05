// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { ListHeaderRecord } from "../../user/records";
import { mountedComponent, screen } from "../../../test-utils";
import { FieldRecord } from "../../record-form";
import { mapEntriesToRecord } from "../../../libs";

import { ExportRecord } from "./records";
import ExportList from "./container";

describe("<ExportList />", () => {
  const initialState = fromJS({
    records: {
      bulk_exports: {
        data: [
          ExportRecord({
            id: "d5e1a4a019ec727efd34a35d1d9a271e",
            file_name: "PRIMERO-CHILD-UNHCR.CSV",
            record_type: "Case",
            started_on: "2020-02-04T20:32:50.078Z"
          }),
          ExportRecord({
            id: "d5e1a4a019ec727efd34a35d1d9a272e",
            file_name: "PRIMERO - CHILD.PDF",
            record_type: "Case",
            started_on: "2020-02-03T20:32:50.078Z"
          }),
          ExportRecord({
            id: "d5e1a4a019ec727efd34a35d1d9a273e",
            file_name: "PRIMERO - CHILD.JSON",
            record_type: "Case",
            started_on: "2020-02-02T20:32:50.078Z"
          })
        ],
        metadata: {
          total: 15,
          per: 20,
          page: 1
        },
        errors: false
      }
    },
    user: {
      listHeaders: {
        bulk_exports: [
          ListHeaderRecord({
            name: "file_name",
            field_name: "file_name",
            id_search: false
          }),
          ListHeaderRecord({
            name: "record_type",
            field_name: "record_type",
            id_search: false
          }),
          ListHeaderRecord({
            name: "started_on",
            field_name: "started_on",
            id_search: false
          })
        ]
      },
      permissions: {
        exports: ["manage"],
        bulk_exports: ["manage"]
      }
    },
    forms: {
      fields: mapEntriesToRecord(
        {
          1: {
            name: "name_first",
            type: "text_field"
          }
        },
        FieldRecord
      ),
      options: {
        lookups: [
          {
            id: 1,
            unique_id: "lookup-location-type",
            values: [
              { id: "country", display_text: "Country" },
              { id: "region", display_text: "Region" }
            ]
          }
        ]
      }
    }
  });

  it("should render a table with three rows", () => {
    mountedComponent(<ExportList />, {}, initialState);
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  it("should render <PageContainer>", () => {
    mountedComponent(<ExportList />, {}, initialState);
    expect(screen.getByTestId("page-container")).toBeInTheDocument(1);
  });

  it("should render <PageHeading>", () => {
    mountedComponent(<ExportList />, {}, initialState);
    expect(screen.getByTestId("page-heading")).toBeInTheDocument();
  });

  it("should render <PageContent>", () => {
    mountedComponent(<ExportList />, {}, initialState);
    expect(screen.getByTestId("page-content")).toBeInTheDocument();
  });

  it("should render <IndexTable>", () => {
    mountedComponent(<ExportList />, {}, initialState);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  describe("when offline", () => {
    const stateOffline = fromJS({
      connectivity: {
        online: false
      },
      records: {
        bulk_exports: {
          data: [
            ExportRecord({
              id: "d5e1a4a019ec727efd34a35d1d9a271e",
              file_name: "PRIMERO-CHILD-UNHCR.CSV",
              record_type: "Case",
              started_on: "2020-02-04T20:32:50.078Z"
            }),
            ExportRecord({
              id: "d5e1a4a019ec727efd34a35d1d9a272e",
              file_name: "PRIMERO - CHILD.PDF",
              record_type: "Case",
              started_on: "2020-02-03T20:32:50.078Z"
            }),
            ExportRecord({
              id: "d5e1a4a019ec727efd34a35d1d9a273e",
              file_name: "PRIMERO - CHILD.JSON",
              record_type: "Case",
              started_on: "2020-02-02T20:32:50.078Z"
            })
          ],
          metadata: {
            total: 15,
            per: 20,
            page: 1
          },
          errors: false
        }
      },
      user: {
        listHeaders: {
          bulk_exports: [
            ListHeaderRecord({
              name: "file_name",
              field_name: "file_name",
              id_search: false
            }),
            ListHeaderRecord({
              name: "record_type",
              field_name: "record_type",
              id_search: false
            }),
            ListHeaderRecord({
              name: "started_on",
              field_name: "started_on",
              id_search: false
            })
          ]
        },
        permissions: {
          exports: ["manage"],
          bulk_exports: ["manage"]
        }
      },
      forms: {
        fields: mapEntriesToRecord(
          {
            1: {
              name: "name_first",
              type: "text_field"
            }
          },
          FieldRecord
        ),
        options: {
          lookups: [
            {
              id: 1,
              unique_id: "lookup-location-type",
              values: [
                { id: "country", display_text: "Country" },
                { id: "region", display_text: "Region" }
              ]
            }
          ]
        }
      }
    });

    it("should render DisabledOffline components for each row", () => {
      mountedComponent(<ExportList />, stateOffline);
      expect(screen.getAllByTestId("disable-offline")).toHaveLength(9);
    });
  });
});
