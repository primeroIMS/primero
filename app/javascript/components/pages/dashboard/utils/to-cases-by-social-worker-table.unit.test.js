import { fromJS } from "immutable";

import { CASES_BY_SOCIAL_WORKER_COLUMNS } from "../components/cases-by-social-worker/constants";

import toCasesBySocialWorkerTable from "./to-cases-by-social-worker-table";

describe("toCasesBySocialWorkerTable - pages/dashboard/utils/", () => {
  const casesBySocialWorker = fromJS({
    name: "dashboard.dash_cases_by_social_worker",
    type: "indicator",
    indicators: {
      cases_by_social_worker_total: {
        primero_admin_cp: {
          count: 1,
          query: ["record_state=true", "status=open", "owned_by=primero_admin_cp"]
        },
        primero_cp: {
          count: 1,
          query: ["record_state=true", "status=open", "owned_by=primero_cp"]
        }
      },
      cases_by_social_worker_new_or_updated: {
        primero_admin_cp: {
          count: 0,
          query: ["record_state=true", "status=open", "not_edited_by_owner=true", "owned_by=primero_admin_cp"]
        },
        primero_cp: {
          count: 0,
          query: ["record_state=true", "status=open", "not_edited_by_owner=true", "owned_by=primero_cp"]
        }
      }
    }
  });

  it("should convert data to plain JS", () => {
    const i18n = { t: value => value };
    const expected = {
      columns: CASES_BY_SOCIAL_WORKER_COLUMNS.map(name => ({
        name,
        label: i18n.t(`dashboard.${name}`)
      })),
      data: [
        ["primero_admin_cp", 1, 0],
        ["primero_cp", 1, 0]
      ],
      query: [
        {
          case_worker: "primero_admin_cp",
          cases_by_social_worker_new_or_updated: [
            "record_state=true",
            "status=open",
            "not_edited_by_owner=true",
            "owned_by=primero_admin_cp"
          ],
          cases_by_social_worker_total: ["record_state=true", "status=open", "owned_by=primero_admin_cp"]
        },
        {
          case_worker: "primero_cp",
          cases_by_social_worker_new_or_updated: [
            "record_state=true",
            "status=open",
            "not_edited_by_owner=true",
            "owned_by=primero_cp"
          ],
          cases_by_social_worker_total: ["record_state=true", "status=open", "owned_by=primero_cp"]
        }
      ]
    };

    expect(toCasesBySocialWorkerTable(casesBySocialWorker, i18n)).to.deep.equal(expected);
  });
});
