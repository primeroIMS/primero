import * as Actions from "./actions";

export const fetchExports = () => async dispatch => {
  dispatch({
    type: Actions.EXPORTS,
    payload: {
      data: [
        {
          id: "d5e1a4a019ec727efd34a35d1d9a271e",
          file: "PRIMERO-CHILD-UNHCR.CSV",
          type: "Case",
          started: "05-Jul-2019 09:36"
        },
        {
          id: "d5e1a4a019ec727efd34a35d1d9a271e",
          file: "PRIMERO - CHILD.PDF",
          type: "Case",
          started: "05-Jul-2019 09:36"
        },
        {
          id: "d5e1a4a019ec727efd34a35d1d9a271e",
          file: "PRIMERO - CHILD.JSON",
          type: "Case",
          started: "05-Jul-2019 09:36"
        },
        {
          id: "d5e1a4a019ec727efd34a35d1d9a271e",
          file: "PRIMERO - CHILD.XLS",
          type: "Case",
          started: "05-Jul-2019 09:36"
        },
        {
          id: "d5e1a4a019ec727efd34a35d1d9a271e",
          file: "PRIMERO - CHILD.CSV",
          type: "Case",
          started: "05-Jul-2019 09:36"
        }
      ]
    }
  });
};
