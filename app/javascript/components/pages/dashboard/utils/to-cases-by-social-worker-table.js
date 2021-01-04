import { CASES_BY_SOCIAL_WORKER_COLUMNS } from "../components/cases-by-social-worker/constants";
import { dataToJS } from "../../../../libs";
// SOURCE
// indicators: {
// "total": {
//   "primero": {
//     "count": 2,
//     "query": [
//       "record_state=true",
//       "status=open",
//       "owned_by=primero"
//     ]
//   },
//   "primero_cp": {
//     "count": 0,
//     "query": [
//       "record_state=true",
//       "status=open",
//       "owned_by=primero_cp"
//     ]
//   }
// },
// "new_or_updated": {
//   "primero": {
//     "count": 1,
//     "query": [
//       "record_state=true",
//       "status=open",
//       "not_edited_by_owner=true",
//       "owned_by=primero"
//     ]
//   },
//   "primero_cp": {
//     "count": 0,
//     "query": [
//       "record_state=true",
//       "status=open",
//       "not_edited_by_owner=true",
//       "owned_by=primero_cp"
//     ]
//   }
// }
// }

// EXPECTED
// columns: [
//   {
//     name: "case_worker",
//     label: "Case Worker"
//   },
//   {
//     name: "total",
//     label: "Total"
//   },
//   {
//     name: "new_and_updated",
//     label: "New & Updated"
//   }
// ],
// data: [
//   ["primero", 0, 10],
//   ["primero_cp", 10, 0]
// ],
// query: [
//   {
//     case_worker: [],
//     total: ["total=true", "owned_by=primero"],
//     new_and_updated: ["new_and_updated=true", "owned_by=primero"]
//   },
//   {
//     case_worker: [],
//     total: ["total=true", "owned_by=primero_cp"],
//     new_and_updated: ["new_and_updated=true", "owned_by=primero_cp"]
//   }
// ]

export default (data, i18n) => {
  const newData = dataToJS(data);
  const rows = Object.keys(Object.values(newData.indicators)[0]);
  const [, ...columnValues] = CASES_BY_SOCIAL_WORKER_COLUMNS;

  const resultData = rows.map(row => {
    const values = columnValues.map(column => newData.indicators[column][row].count);

    return [row, ...values];
  });

  const resultQuery = rows.map(row => {
    const values = CASES_BY_SOCIAL_WORKER_COLUMNS.map(column => ({
      [column]: column === CASES_BY_SOCIAL_WORKER_COLUMNS[0] ? [] : []
    }));

    console.log(values);

    return values;
  });

  const result = {
    columns: CASES_BY_SOCIAL_WORKER_COLUMNS.map(name => ({
      name,
      label: i18n.t(`dashboard.${name}`)
    })),
    data: resultData,
    query: resultQuery
  };

  console.log(result);

  return result;
};
