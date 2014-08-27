module IndexHelper
  def index_highlighted_case_name(highlighted_fields, record)
    highlighted_fields.each do |relevant_field|
      if relevant_field.visible?
        if relevant_field.hidden_text_field && record.hidden_name
          return I18n.t("cases.hidden_text_field_text")
        else
          return record[relevant_field[:name]]
        end
      end
    end
  end

	def list_view_header(record)
		case record
		when "case"
			return [
				{title: nil, sort_title: 'flag'},
				{title: 'id', sort_title: 'short_id'},
				{title: 'name', sort_title: 'sortable_name'},
				{title: 'age', sort_title: 'age'},
				{title: 'sex', sort_title: 'sex'},
				{title: 'registration_date', sort_title: 'registration_date'},
				{title: 'status', sort_title: 'child_status'}
			]
		when "incident"
			return [
				{title: 'id', sort_title: 'short_id'},
				{title: 'survivor_code', sort_title: 'survivor_code'},
				{title: 'case_worker_code', sort_title: 'caseworker_code'},
				{title: 'date_of_interview', sort_title: 'date_of_first_report'},
				{title: 'date_of_incident', sort_title: 'start_date_of_incident_from'},
			]
			when "tracing_request"
			return [
			  {title: 'id', sort_title: 'short_id'},
			  {title: 'name_of_inquirer', sort_title: 'relation_name'},
			  {title: 'date_of_inquiry', sort_title: 'inquiry_date'}
			  ]
		else
			[]
		end
	end
end
