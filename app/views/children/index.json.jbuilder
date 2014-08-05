json.draw @draw || 0
json.iTotalRecords @children_total || 0
json.recordsFiltered @children_total || 0

json.data @children do |child|
	json.flag child.flag? ? icon('flag', '', class: 'flagged') : ""
  json.id link_to text_to_identify_child(child), case_path(child), class: 'id_link'
  json.name index_highlighted_case_name(@highlighted_fields, child)
  json.age child.age
  json.sex child.sex
  json.registration_date child.created_at
  json.status child.status
end
