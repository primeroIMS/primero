import PageContent from "../../../page/components/page-content";
import PageHeading from "../../../page/components/page-heading";
import Permission, { MANAGE, RESOURCES } from "../../../permissions";
import IndexTable from "../../../index-table";
import { useI18n } from "../../../i18n";

function Component() {
    const i18n = useI18n();
    const tableOptions = {
        onTableCHange: () => {},
    }
    return (
    <Permission resources={RESOURCES.metadata} actions={MANAGE} redirect>
      <PageHeading title={i18n.t("settings.navigation.messages")}></PageHeading>
      <PageContent>
        <p>Hello world</p>
        {/* <IndexTable title={i18n.t("settings.navigation.messages")} {...tableOptions} /> */}
      </PageContent>
    </Permission>
    )
}

Component.propTypes = {}
Component.displayName = "MessagesList";

export default Component;

