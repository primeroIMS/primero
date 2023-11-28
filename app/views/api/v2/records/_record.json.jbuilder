# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.id record.id
json.enabled record.record_state
json.permitted_forms Role.form_permissions(@authorized_roles) if @display_permitted_forms
json.merge! @record_data_service.data(record, current_user, selected_field_names)
