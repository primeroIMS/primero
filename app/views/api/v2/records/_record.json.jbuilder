# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.id record.id
json.enabled record.record_state
json.permitted_form record.authorized_forms(current_user) if @referred_to_user
json.merge! @record_data_service.data(record, current_user, selected_field_names)
