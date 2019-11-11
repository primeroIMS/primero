import * as Actions from "./actions";

export const fetchExports = () => {
  return {
    type: Actions.EXPORTS,
    payload: {
      data: [
        {
          id: "d5e1a4a019ec727efd34a35d1d9a271e",
          file_name: "PRIMERO-CHILD-UNHCR.CSV",
          record_type: "Case",
          started_on: "05-Jul-2019 09:36"
        },
        {
          id: "d5e1a4a019ec727efd34a35d1d9a271e",
          file_name: "PRIMERO - CHILD.PDF",
          record_type: "Case",
          started_on: "05-Jul-2019 09:36"
        },
        {
          id: "d5e1a4a019ec727efd34a35d1d9a271e",
          file_name: "PRIMERO - CHILD.JSON",
          record_type: "Case",
          started_on: "05-Jul-2019 09:36"
        },
        {
          id: "d5e1a4a019ec727efd34a35d1d9a271e",
          file_name: "PRIMERO - CHILD.XLS",
          record_type: "Case",
          started_on: "05-Jul-2019 09:36"
        },
        {
          id: "d5e1a4a019ec727efd34a35d1d9a271e",
          file_name: "PRIMERO - CHILD.CSV",
          record_type: "Case",
          started_on: "05-Jul-2019 09:36"
        }
      ],
      metadata: {
        per: 20,
        total: 5,
        page: 1
      }
    }
  };
};
