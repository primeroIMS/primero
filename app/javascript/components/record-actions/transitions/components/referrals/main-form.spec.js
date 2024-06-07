import { Formik } from "formik";
import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../../test-utils";

import MainForm from "./main-form";

// eslint-disable-next-line react/display-name
const FormikStub = props => {
  // eslint-disable-next-line react/prop-types
  const { formProps } = props;

  return <Formik {...formProps} />;
};

describe("<MainForm />", () => {
  const initialState = fromJS({
    records: {
      transitions: {
        referral: {
          errors: [],
          users: [{ id: 1, user_name: "primero" }]
        }
      }
    },
    application: {
      agencies: [{ unique_id: "agency-unicef", name: "UNICEF" }]
    },
    forms: {
      options: [
        {
          type: "lookup-service-type",
          options: [{ id: "health", display_text: "Health" }]
        },
        {
          type: "reporting_location",
          options: [{ id: "location_a", display_text: "Location A" }]
        }
      ]
    }
  });
  const mainFormProps = {
    canConsentOverride: false,
    disabled: false,
    handleClose: () => {},
    providedConsent: true,
    recordType: "cases",
    setDisabled: () => {}
  };
  const props = {
    formProps: {
      initialValues: {
        agency: "",
        location: "",
        notes: "",
        referral: false,
        remoteSystem: false,
        services: "",
        transitioned_to: ""
      },
      handleSubmit: () => {},
      render: p => <MainForm formProps={p} rest={mainFormProps} />
    }
  };

  it("renders Form", () => {
    mountedComponent(<FormikStub {...props} />, initialState);
    expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "form")).toBeInTheDocument();
  });

  it("renders ProvidedConsent", () => {
    mountedComponent(<FormikStub {...props} />, initialState);
    expect(screen.queryAllByText(/referral.service_label/i)).toHaveLength(2);
  });

  it("renders ProvidedConsent with valid props", () => {
    mountedComponent(<FormikStub {...props} />, initialState);
    expect(screen.queryAllByText(/referral.service_label/i)).toHaveLength(2);
  });

  it("renders FormControlLabel", () => {
    mountedComponent(<FormikStub {...props} />, initialState);
    expect(screen.queryAllByRole("textbox")).toHaveLength(5);
  });

  it("renders FormInternal", () => {
    mountedComponent(<FormikStub {...props} />, initialState);
    expect(screen.queryAllByRole("textbox")).toHaveLength(5);
  });

  describe("when mounting fields for FormInternal ", () => {
    it("renders valid props for SERVICE_FIELD field", () => {
      mountedComponent(<FormikStub {...props} />, initialState);
      expect(screen.queryAllByRole("textbox")).toHaveLength(5);
    });

    it("renders valid props for AGENCY_FIELD field", () => {
      mountedComponent(<FormikStub {...props} />, initialState);
      expect(screen.queryAllByRole("textbox")).toHaveLength(5);
    });

    it("renders valid props for LOCATION_FIELD field", () => {
      mountedComponent(<FormikStub {...props} />, initialState);
      expect(screen.queryAllByRole("textbox")).toHaveLength(5);
    });

    it("renders valid props for TRANSITIONED_TO_FIELD field", () => {
      mountedComponent(<FormikStub {...props} />, initialState);
      expect(screen.queryAllByRole("textbox")).toHaveLength(5);
    });

    it("renders valid props for NOTES_FIELD field", () => {
      mountedComponent(<FormikStub {...props} />, initialState);
      expect(screen.queryAllByRole("textbox")).toHaveLength(5);
    });
  });
});
