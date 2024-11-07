# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
# A class that defines aggregate functions to be applied in subforms to calculate summary field values
class SubformSummaryService < ValueObject
  attr_accessor :subforms, :args

  def first
    return unless perform?

    sort_subforms.first[args['field_name']]
  end

  def last
    return unless perform?

    sort_subforms.last[args['field_name']]
  end

  def perform?
    subforms.present? && args['field_name'].present?
  end

  def sort_subforms
    return subforms unless subforms.present? && args['order_by'].present?

    sorted_subforms = subforms.sort_by { |subform| subform[args['order_by']] }
    return sorted_subforms unless args['order'] == 'desc'

    sorted_subforms.reverse
  end
end
