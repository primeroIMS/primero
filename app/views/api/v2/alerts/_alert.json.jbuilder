json.alert_for alert.try(:alert_for)
json.type alert.try(:type)
json.date (alert.date.strftime("%d-%b-%Y") if alert.date.present?)
#TODO: this should be a new field or did you mean form_sidebar_id?
json.form_unique_id alert.try(:form_unique_id)