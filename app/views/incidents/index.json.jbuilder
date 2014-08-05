json.draw @draw || 0
json.iTotalRecords @incidents_total || 0
json.recordsFiltered @incidents_total || 0

json.data @incidents do |incident|
  json.id link_to text_to_identify_incident(incident), incident_path(incident), class: 'id_link'
  json.survivor_code incident.survivor_code
  json.caseworker_code incident.caseworker_code
  json.date_of_first_report incident.date_of_first_report
  json.start_date_of_incident_from incident.start_date_of_incident_from
end