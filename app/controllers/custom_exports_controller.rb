class CustomExportsController < ApplicationController

  def permitted_forms_list
    module_id = [params['module']]
    record_type = params['record_type']
    permitted_forms = PrimeroModule.all(keys: module_id).first.associated_forms
                                   .select{|sel| sel.parent_form == record_type}
                                   .map{|form| {name: form.name, id: form.unique_id}}

    render json: permitted_forms
  end
end