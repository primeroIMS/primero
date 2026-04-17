export default [
  { label: "primero" },
  { label: "primero_admin_cp" },
  { label: "primero_cp" },
  { label: "primero_mgr_cp" },
  { label: "primero_gbv" },
  { label: "primero_mgr_gbv" },
  { label: "primero_ftr_manager" },
  { label: "primero_user_mgr_cp" },
  { label: "primero_user_mgr_gbv" },
  { label: "agency_user_admin" }
].map(suggestion => ({
  value: suggestion.label.toLowerCase(),
  label: suggestion.label
}));
