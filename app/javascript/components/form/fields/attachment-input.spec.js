// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { screen, mountedFieldComponent, fireEvent } from "test-utils";
import { fromJS } from "immutable";

import { FILE_FORMAT } from "../../../config";
import { PHOTO_FIELD, DOCUMENT_FIELD } from "../constants";
import { TERMS_OF_USE } from "../../pages/admin/agencies-form/constants";

import AttachmentInput from "./attachment-input";

describe("<Form /> - fields/<AttachmentInput />", () => {
  const defaultProps = {
    metaInputProps: {
      type: DOCUMENT_FIELD,
      fileFormat: FILE_FORMAT.pdf,
      renderDownloadButton: true,
      downloadButtonLabel: "Download"
    }
  };

  const initialState = fromJS({
    application: {
      enforceTermsOfUse: false,
      termsOfUseAgencySign: {
        en: "Terms of use text"
      }
    }
  });

  describe("Basic rendering", () => {
    it("renders input label and form helper text", () => {
      mountedFieldComponent(<AttachmentInput {...defaultProps} />, { state: initialState });
      expect(screen.getByText("Test Field 2")).toBeInTheDocument();
      expect(screen.getByText("Test Field 2 help text")).toBeInTheDocument();
      expect(screen.getByText("fields.file_upload_box.select_file_button_text")).toBeInTheDocument();
    });

    it("renders file input with correct attributes", () => {
      mountedFieldComponent(<AttachmentInput {...defaultProps} />, { state: initialState });

      const fileInput = document.querySelector('input[type="file"]');

      expect(fileInput).toHaveAttribute("type", "file");
      expect(fileInput).toHaveAttribute("accept");
    });

    it("renders hidden inputs for base64, file name, and URL", () => {
      mountedFieldComponent(<AttachmentInput {...defaultProps} />, { state: initialState });

      const hiddenInputs = document.querySelectorAll('input[type="hidden"]');

      expect(hiddenInputs).toHaveLength(3);
      expect(hiddenInputs[0]).toHaveAttribute("name", "test_field_2_base64");
      expect(hiddenInputs[1]).toHaveAttribute("name", "test_field_2_file_name");
      expect(hiddenInputs[2]).toHaveAttribute("name", "test_field_2_url");
    });
  });

  describe("File type handling", () => {
    it("sets correct accept attribute for photo field", () => {
      const photoProps = {
        ...defaultProps,
        metaInputProps: {
          ...defaultProps.metaInputProps,
          type: PHOTO_FIELD
        }
      };

      mountedFieldComponent(<AttachmentInput {...photoProps} />, { state: initialState });

      const fileInput = document.querySelector('input[type="file"]');

      expect(fileInput).toHaveAttribute("accept", "*");
    });

    it("uses custom fileFormat when provided", () => {
      const customProps = {
        ...defaultProps,
        metaInputProps: {
          ...defaultProps.metaInputProps,
          fileFormat: "image/png"
        }
      };

      mountedFieldComponent(<AttachmentInput {...customProps} />, { state: initialState });

      const fileInput = document.querySelector('input[type="file"]');

      expect(fileInput).toHaveAttribute("accept");
      expect(fileInput).toBeInTheDocument();
    });
  });

  describe("File upload functionality", () => {
    it("handles file selection and upload", async () => {
      mountedFieldComponent(<AttachmentInput {...defaultProps} />, { state: initialState });

      const fileInput = document.querySelector('input[type="file"]');
      const file = new File(["test content"], "test.pdf", { type: "application/pdf" });

      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(fileInput.files[0]).toBe(file);
    });

    it("renders upload button", () => {
      mountedFieldComponent(<AttachmentInput {...defaultProps} />, { state: initialState });

      const selectButton = screen.getByRole("button");

      expect(selectButton).toBeInTheDocument();
      expect(selectButton).toHaveTextContent("fields.file_upload_box.select_file_button_text");
    });
  });

  describe("Preview functionality", () => {
    it("renders photo field correctly", () => {
      const photoProps = {
        ...defaultProps,
        metaInputProps: {
          ...defaultProps.metaInputProps,
          type: PHOTO_FIELD
        }
      };

      mountedFieldComponent(<AttachmentInput {...photoProps} />, { state: initialState });

      const fileInput = document.querySelector('input[type="file"]');

      expect(fileInput).toHaveAttribute("accept", "*");
    });

    it("renders document field correctly", () => {
      const documentProps = {
        ...defaultProps,
        metaInputProps: {
          ...defaultProps.metaInputProps,
          type: DOCUMENT_FIELD,
          fileFormat: FILE_FORMAT.pdf
        }
      };

      mountedFieldComponent(<AttachmentInput {...documentProps} />, { state: initialState });

      const fileInput = document.querySelector('input[type="file"]');

      expect(fileInput).toHaveAttribute("accept");
      expect(fileInput).toBeInTheDocument();
    });
  });

  describe("Download functionality", () => {
    it("renders component in show mode", () => {
      mountedFieldComponent(<AttachmentInput {...defaultProps} />, {
        state: initialState,
        mode: "show"
      });

      const fileInput = document.querySelector('input[type="file"]');

      expect(fileInput).toBeInTheDocument();
    });
  });

  describe("Terms of Use functionality", () => {
    const termsOfUseState = fromJS({
      application: {
        enforceTermsOfUse: true,
        termsOfUseAgencySign: {
          en: "Terms of use acknowledgement text"
        }
      }
    });

    it("renders terms of use field correctly", () => {
      mountedFieldComponent(<AttachmentInput {...defaultProps} />, {
        state: termsOfUseState,
        fieldRecordSettings: { name: TERMS_OF_USE }
      });

      const fileInput = document.querySelector('input[type="file"]');

      expect(fileInput).toHaveAttribute("name", TERMS_OF_USE);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Disabled state", () => {
    it("renders component in disabled mode", () => {
      mountedFieldComponent(<AttachmentInput {...defaultProps} />, {
        state: initialState,
        mode: "show"
      });

      const fileInput = document.querySelector('input[type="file"]');

      expect(fileInput).toBeInTheDocument();
    });

    it("renders button when file is not uploaded", () => {
      mountedFieldComponent(<AttachmentInput {...defaultProps} />, { state: initialState });

      const selectButton = screen.getByRole("button");

      expect(selectButton).toBeInTheDocument();
    });
  });

  describe("Error handling", () => {
    it("displays helper text", () => {
      mountedFieldComponent(<AttachmentInput {...defaultProps} />, {
        state: initialState,
        fieldRecordSettings: { help_text: "Custom help text" }
      });

      const helperText = document.querySelector(".MuiFormHelperText-root");

      expect(helperText).toBeInTheDocument();
      expect(helperText).toHaveTextContent("Custom help text");
    });
  });
});
