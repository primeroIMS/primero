json.alert_for alert.alert_for
json.type alert.type
json.date (alert.date.strftime("%Y-%b-%d") if alert.date.present?)
json.form_unique_id alert.form_sidebar_id