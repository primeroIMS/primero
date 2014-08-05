module DatatablesHelper
	def index_highlighted_case_name(highlighted_fields, record)
		highlighted_fields.each do |relevant_field| 
    	if relevant_field.visible?
      	return record[relevant_field[:name]] 
     	end
    end 
	end
end