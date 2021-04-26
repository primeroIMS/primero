# frozen_string_literal: true

json.id trace.id
json.matched_case_id trace.matched_case_id
json.tracing_request_id trace.tracing_request.id
json.inquirer_id trace.tracing_request.inquirer_id
json.relation trace.relation
json.relation_name trace.tracing_request.relation_name
json.inquiry_date trace.tracing_request.inquiry_date
json.name trace.name
json.age trace.age
json.sex trace.sex
json.matched_case_comparison trace.matched_case_comparison  if trace.matched_case_id.present?
