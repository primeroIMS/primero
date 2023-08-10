import { FastField } from "formik";

import { mountedComponent, screen} from "../../../../../test-utils";
import { FieldRecord } from "../../../records";
import TickField from "../tick-field";
import DateField from "../date-field";
import { MODULES } from "../../../../../config";

import DocumentField from "./document-field";

describe("<DocumentField />", () => {
  const props = {
    name: "attachment_field_test",
    title: "title",
    index: 0,
    field: FieldRecord({
      date_include_time: false,
      selected_value: "",
      type: "date_field"
    }),
    arrayHelpers: {
      form: {
        values: {
          module_id: MODULES.CP
        }
      }
    },
    value: {
      is_current: false,
      file_name: "dummy.pdf",
      date: "2022-06-07",
      field_name: "upload_supporting_material",
      record: {
        id: "7d34b080-60bb-45e5-9ac3-197f66b3d5e6",
        enabled: true,
        last_updated_at: "2022-06-07T21:46:44.917Z"
      },
      attachment_url: "test",
      comments: "random comment",
      id: 3,
      description: "test docuemnt"
    },
    resetOpenLastDialog: () => {},
    open: true,
    mode: {
      isShow: true,
      isEdit: false
    },
    attachment: ""
  };

  const formProps = {
    initialValues: {}
  };

  it("should render a DocumentField", () => {
    mountedComponent(<DocumentField {...props} />, {}, [],{}, formProps);
    expect(screen.getByText(/fields.document.is_current/i)).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(3);
    expect(screen.getByText(/yes_label/i)).toBeInTheDocument();
  });

  it("should NOT render render a TickField", () => {
    const propsMRM = {
      ...props,
      arrayHelpers: {
        form: {
          values: {
            module_id: MODULES.MRM
          }
        }
      }
    };
    mountedComponent(<DocumentField {...propsMRM} />, {}, [],{}, formProps);

    expect(screen.queryByText(/yes_label/i)).toBeNull();
  });
});
