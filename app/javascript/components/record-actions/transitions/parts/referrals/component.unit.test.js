import { expect } from "chai";
import clone from "lodash/clone";
import { Map, List, fromJS } from "immutable";
import { Formik } from "formik";
import { FormControlLabel } from "@material-ui/core";
import { Checkbox as MuiCheckbox } from "formik-material-ui";

import { setupMountedComponent } from "../../../../../test";
import users from "../../mocked-users";

import FormInternal from "./form-internal";
import ProvidedConsent from "./provided-consent";
import ReferralForm from "./component";

describe("<ReferralForm />", () => {
  context("Create referral", () => {
    let component;
    const initialState = fromJS({
      records: {
        transitions: {
          mockUsers: users
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
    const record = Map({
      id: "03cdfdfe-a8fc-4147-b703-df976d200977",
      case_id: "1799d556-652c-4ad9-9b4c-525d487b5e7b",
      case_id_display: "9b4c525",
      name_first: "W",
      name_last: "D",
      name: "W D"
    });
    const props = {
      handleClose: () => {},
      userPermissions: Map({}),
      providedConsent: false,
      recordType: "cases",
      record
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        ReferralForm,
        props,
        initialState
      ));
    });

    it("renders Formik", () => {
      expect(component.find(Formik)).to.have.length(1);
    });

    it("renders FormInternal", () => {
      expect(component.find(FormInternal)).to.have.length(1);
    });

    it("renders ProvidedConsent", () => {
      expect(component.find(ProvidedConsent)).to.have.length(1);
    });

    it("renders FormControlLabel", () => {
      expect(component.find(FormControlLabel)).to.have.length(1);
    });

    it("renders MuiCheckbox", () => {
      expect(component.find(MuiCheckbox)).to.have.length(1);
    });

    it("should accept valid props", () => {
      const componentProps = clone(
        component.find(ReferralForm).first().props()
      );

      expect(componentProps).to.have.property("handleClose");
      expect(componentProps).to.have.property("userPermissions");
      expect(componentProps).to.have.property("providedConsent");
      expect(componentProps).to.have.property("recordType");
      expect(componentProps).to.have.property("record");
      delete componentProps.handleClose;
      delete componentProps.userPermissions;
      delete componentProps.providedConsent;
      delete componentProps.recordType;
      delete componentProps.record;

      expect(componentProps).to.deep.equal({});
    });

    it("renders Formik with valid props", () => {
      const formikProps = { ...component.find(Formik).props() };

      expect(component.find(Formik)).to.have.lengthOf(1);
      [
        "enableReinitialize",
        "initialValues",
        "isInitialValid",
        "onSubmit",
        "render",
        "validateOnBlur",
        "validateOnChange",
        "validationSchema"
      ].forEach(property => {
        expect(formikProps).to.have.property(property);
        delete formikProps[property];
      });
      expect(formikProps).to.be.empty;
    });
  });

  context("Create referral from service", () => {
    let component;
    const serviceToRefer = {
      service_response_day_time: "2020-03-26T23:03:15.295Z",
      service_type: "health",
      unique_id: "683cd3a1-9711-4a7d-856b-33dc5d4b8b8b",
      service_response_type: "care_plan",
      service_status_referred: true,
      service_delivery_location: "94132416565b",
      service_is_referrable: true,
      service_implemented_day_time: null,
      service_appointment_date: null,
      service_implemented: "not_implemented",
      service_implementing_agency: "agency-health",
      service_implementing_agency_individual: "user-health"
    };
    const initialState = fromJS({
      records: {
        transitions: {
          mockUsers: users
        }
      },
      forms: {
        options: {
          lookups: [
            {
              type: "lookup-service-type",
              options: [{ id: "health", display_text: "Health" }]
            },
            {
              type: "reporting_location",
              options: [{ id: "location_a", display_text: "Location A" }]
            }
          ],
          agencies: [{ unique_id: "agency-unicef", name: "UNICEF" }]
        },
        serviceToRefer
      }
    });
    const record = Map({
      id: "03cdfdfe-a8fc-4147-b703-df976d200977",
      case_id: "1799d556-652c-4ad9-9b4c-525d487b5e7b",
      case_id_display: "9b4c525",
      name_first: "W",
      name_last: "D",
      name: "W D",
      services_section: [serviceToRefer]
    });
    const props = {
      handleClose: () => {},
      userPermissions: Map({}),
      providedConsent: false,
      recordType: "cases",
      record
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        ReferralForm,
        props,
        initialState
      ));
    });

    it("renders Formik", () => {
      expect(component.find(Formik)).to.have.length(1);
    });

    it("renders Formik with initial values from the service", () => {
      const formikProps = { ...component.find(Formik).props() };
      const {
        services,
        agency,
        location,
        service_record_id: serviceRecordId
      } = formikProps.initialValues;

      expect(services).to.be.equal(serviceToRefer.service_type);
      expect(agency).to.be.equal(serviceToRefer.service_implementing_agency);
      expect(location).to.be.equal(serviceToRefer.service_delivery_location);
      expect(serviceRecordId).to.be.equal(serviceToRefer.unique_id);
    });
  });
});
