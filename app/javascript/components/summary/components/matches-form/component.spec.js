// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../test-utils";

import MatchesForm from "./component";

describe("<MatchesForm />", () => {
  const props = {
    record: fromJS({ id: "12345678", case_id_display: "123abc" }),
    title: "Test Title",
    open: true,
    cancelHandler: () => {},
    css: {},
    i18n: { t: value => value },
    mode: { isNew: false },
    matchedTracesData: fromJS([])
  };
  const formProps = {
    initialValues: {
      name: ""
    }
  };
  const state = fromJS({
    records: {
      cases: {
        potentialMatches: {
          data: [
            {
              likelihood: "likely",
              score: 1,
              case: {
                id: "b216d9a8-5390-4d20-802b-ae415151ddbf",
                case_id_display: "35e4065",
                name: "Enrique Bunbury"
              },
              trace: {
                inquiry_date: "2021-01-13",
                tracing_request_id: "f6c3483e-d6e6-482e-bd7a-9c5808e0798c",
                name: "Gustavo Cerati"
              },
              comparison: {
                case_to_trace: [
                  {
                    field_name: "age",
                    match: "mismatch",
                    case_value: 4,
                    trace_value: 10
                  }
                ]
              }
            }
          ],
          loading: false,
          errors: false
        }
      }
    }
  });

  beforeEach(() => {
    mountedComponent(<MatchesForm {...props} />, state, {}, [], formProps);
  });

  it("should render tracing request id in the title", () => {
    expect(screen.getByText("tracing_requests.id: #123abc")).toBeInTheDocument();
  });

  it("should render 1 <IndexTable /> components", () => {
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });
});
