import { useForm } from "react-hook-form";

import SelectInput from "../../../form/fields/select-input";

import css from "./styles.css";

const Component = () => {
  const formMethods = useForm();

  return (
    <form>
      <div className={css.container}>
        <div>
          <SelectInput
            commonInputProps={{ name: "", label: "Filter 1" }}
            metaInputProps={{}}
            formMethods={formMethods}
            options={[]}
          />
        </div>
        <div>
          <SelectInput
            commonInputProps={{ name: "", label: "Filter 1" }}
            metaInputProps={{}}
            formMethods={formMethods}
            options={[]}
          />
        </div>
        <div>
          <SelectInput
            commonInputProps={{ name: "", label: "Filter 1" }}
            metaInputProps={{}}
            formMethods={formMethods}
            options={[]}
          />
        </div>
        <div>
          <SelectInput
            commonInputProps={{ name: "", label: "Filter 1" }}
            metaInputProps={{}}
            formMethods={formMethods}
            options={[]}
          />
        </div>
      </div>
    </form>
  );
};

Component.displayName = "InsightsFilters";

export default Component;
