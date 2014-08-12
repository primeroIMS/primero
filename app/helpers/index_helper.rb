module IndexHelper
	def index_highlighted_case_name(highlighted_fields, record)
		highlighted_fields.each do |relevant_field|
    	if relevant_field.visible?
      	return record[relevant_field[:name]]
     	end
    end
	end

	def list_view_header(record)
		case record
		when "case"
			return [
				'flag',
				'id',
				'name',
				'age',
				'sex',
				'registration_date',
				'status'
			]
		when "incident"
			return [
				'id',
				'survivor_code',
				'caseworker_code',
				'date_of_first_report',
				'start_date_of_incident_from'
			]
		else
			[]
		end
	end
end
