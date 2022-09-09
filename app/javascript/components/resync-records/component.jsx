import { useCallback, useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";

import Queue from "../../libs/queue";
import { DATE_TIME_FORMAT, METHODS, RECORD_TYPES } from "../../config";
import { get } from "../form/utils";
import { useI18n } from "../i18n";
import { defaultTableOptions } from "../index-table/utils";
import { PageHeading } from "../page";
import ActionButton from "../action-button";
import { useMemoizedSelector } from "../../libs";
import { getQueueData } from "../connectivity/selectors";
import DisableOffline from "../disable-offline";

function Component() {
  const i18n = useI18n();
  const title = i18n.t("navigation.support_menu.resync");
  const data = useMemoizedSelector(state => getQueueData(state));
  const [pending, setPending] = useState(false);

  const columns = [
    {
      name: "id",
      label: i18n.t(`resync_records.id`)
    },
    {
      name: "record_type",
      label: i18n.t(`resync_records.record_type`)
    },
    {
      name: "action",
      label: i18n.t(`resync_records.action`)
    },
    {
      name: "date",
      label: i18n.t(`resync_records.date`)
    },
    {
      name: "last_attempt",
      label: i18n.t(`resync_records.last_attempt`)
    }
  ];

  const options = {
    ...defaultTableOptions({ simple: true }),
    selectToolbarPlacement: "none",
    elevation: 3,
    rowHover: data.size > 0
  };

  const translateMethods = method => i18n.t(`resync_records.${method === METHODS.POST ? "create" : "update"}`);

  const parsedData = data.reduce((prev, current) => {
    return [
      ...prev,
      {
        id: get(current, "api.body.data.id"),
        record_type: i18n.t(`forms.record_types.${RECORD_TYPES[get(current, "api.recordType")]}`),
        action: translateMethods(get(current, "api.method")),
        date: i18n.localizeDate(get(current, "api.body.data.created_at")),
        last_attempt: i18n.localizeDate(get(current, "last_attempt"), DATE_TIME_FORMAT)
      }
    ];
  }, []);

  const handleResync = useCallback(() => {
    if (data.size) {
      setPending(true);
    }
    Queue.triggerProcess();
  }, [data.size]);

  useEffect(() => {
    setPending(false);
  }, [data.size]);

  return (
    <>
      <PageHeading title={title} noElevation noPadding>
        <DisableOffline button>
          <ActionButton onClick={handleResync} text="resync_records.resync" pending={pending} />
        </DisableOffline>
      </PageHeading>
      <MUIDataTable title={title} columns={columns} options={options} data={parsedData} />
    </>
  );
}

Component.displayName = "ResyncRecords";

export default Component;
