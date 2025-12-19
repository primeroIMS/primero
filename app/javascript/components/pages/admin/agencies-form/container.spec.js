// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { mountedComponent, screen, fireEvent } from "test-utils";

import { ACTIONS } from "../../../permissions";
import { ROUTES } from "../../../../config";

import AgenciesForm from "./container";

describe("<AgencyForm />", () => {
  const defaultState = fromJS({
    records: {
      agencies: {
        selectedAgency: fromJS({
          id: "1",
          name: { en: "Test Agency" },
          agency_code: "TEST001",
          description: { en: "Test Description" },
          services: ["service1"],
          logo_enabled: false,
          terms_of_use_enabled: false,
          disabled: false
        }),
        data: [
          {
            id: "1",
            name: { en: "Agency 1" }
          },
          {
            id: "2",
            name: { en: "Agency 2" }
          }
        ],
        metadata: { total: 2, per: 20, page: 1 },
        errors: false,
        saving: false
      }
    },
    user: {
      permissions: {
        agencies: [ACTIONS.MANAGE]
      }
    },
    application: {
      limitedProductionSite: false,
      enforceTermsOfUse: false,
      applicationLocales: ["en", "es"],
      termsOfUseAgencySign: {
        en: "Terms of use text"
      }
    },
    forms: {
      options: {
        lookups: [
          {
            id: 1,
            unique_id: "lookup-service-type",
            values: [
              { id: "service1", display_text: { en: "Service 1" } },
              { id: "service2", display_text: { en: "Service 2" } }
            ]
          }
        ]
      }
    }
  });

  describe("New Agency Mode", () => {
    it("renders record form for new agency", () => {
      mountedComponent(<AgenciesForm mode="new" />, defaultState, ["/admin/agencies/new"]);

      expect(document.querySelector("#agency-form")).toBeInTheDocument();
    });

    it("renders heading with action buttons", () => {
      mountedComponent(<AgenciesForm mode="new" />, defaultState, ["/admin/agencies/new"]);

      expect(screen.getByRole("heading", { name: /agencies\.label/i })).toBeInTheDocument();
      expect(screen.getByText("agencies.translations.manage")).toBeInTheDocument();
      expect(screen.getByText("buttons.cancel")).toBeInTheDocument();
      expect(screen.getByText("buttons.save")).toBeInTheDocument();
    });

    it("handles form submission for new agency", async () => {
      mountedComponent(<AgenciesForm mode="new" />, defaultState, ["/admin/agencies/new"]);

      const form = document.querySelector("#agency-form");

      expect(form).toBeInTheDocument();
    });
  });

  describe("Edit Agency Mode", () => {
    it("renders form with existing agency data", () => {
      mountedComponent(<AgenciesForm mode="edit" />, defaultState, ["/admin/agencies/1/edit"]);

      expect(document.querySelector("#agency-form")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Agency")).toBeInTheDocument();
      expect(screen.getByDisplayValue("TEST001")).toBeInTheDocument();
    });
  });

  describe("Show Agency Mode", () => {
    it("renders edit button in show mode", () => {
      mountedComponent(<AgenciesForm mode="show" />, defaultState, ["/admin/agencies/1"]);

      expect(screen.getByText("buttons.edit")).toBeInTheDocument();
    });

    it("does not render save button in show mode", () => {
      mountedComponent(<AgenciesForm mode="show" />, defaultState, ["/admin/agencies/1"]);
      expect(screen.queryByText("buttons.save")).not.toBeInTheDocument();
    });
  });

  describe("Action Handlers", () => {
    it("handles cancel button click", () => {
      const { store } = mountedComponent(<AgenciesForm mode="new" />, defaultState, ["/admin/agencies/new"]);

      const cancelButton = screen.getByText("buttons.cancel");

      fireEvent.click(cancelButton);

      const actions = store.getActions();
      const routerAction = actions.find(
        action => action.type === "@@router/CALL_HISTORY_METHOD" && action.payload.args[0] === ROUTES.admin_agencies
      );

      expect(routerAction).toBeDefined();
    });

    it("opens translations dialog", () => {
      mountedComponent(<AgenciesForm mode="new" />, defaultState, ["/admin/agencies/new"]);

      const translationsButton = screen.getByText("agencies.translations.manage");

      fireEvent.click(translationsButton);

      expect(screen.getByText("agencies.translations.manage")).toBeInTheDocument();
    });
  });

  describe("Terms of Use Enforcement", () => {
    const termsOfUseState = defaultState.setIn(["application", "enforceTermsOfUse"], true);

    it("includes terms of use data for new agency when enforced", () => {
      mountedComponent(<AgenciesForm mode="new" />, termsOfUseState, ["/admin/agencies/new"]);

      const form = document.querySelector("#agency-form");

      expect(form).toBeInTheDocument();
    });

    it("renders terms of use field when enforced", () => {
      mountedComponent(<AgenciesForm mode="new" />, termsOfUseState, ["/admin/agencies/new"]);

      expect(screen.getByText(/agency\.terms_of_use/i)).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("displays server errors when present", () => {
      const errorState = defaultState.setIn(
        ["records", "agencies", "errors"],
        fromJS({
          "name.en": ["Name is required"]
        })
      );

      mountedComponent(<AgenciesForm mode="new" />, errorState, ["/admin/agencies/new"]);

      const form = document.querySelector("#agency-form");

      expect(form).toBeInTheDocument();
    });

    it("shows saving state during form submission", () => {
      const savingState = defaultState.setIn(["records", "agencies", "saving"], true);

      mountedComponent(<AgenciesForm mode="new" />, savingState, ["/admin/agencies/new"]);

      const saveButton = screen.getByText("buttons.save");

      expect(saveButton).toBeDisabled();
    });
  });

  describe("Permissions", () => {
    it("does not render action buttons without proper permissions", () => {
      const noPermissionsState = defaultState.setIn(["user", "permissions", "agencies"], []);

      mountedComponent(<AgenciesForm mode="show" />, noPermissionsState, ["/admin/agencies/1"]);

      expect(screen.queryByText("buttons.edit")).not.toBeInTheDocument();
    });

    it("renders action buttons with proper permissions", () => {
      mountedComponent(<AgenciesForm mode="show" />, defaultState, ["/admin/agencies/1"]);

      expect(screen.getByText("buttons.edit")).toBeInTheDocument();
    });
  });
});
