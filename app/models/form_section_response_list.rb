# frozen_string_literal: true

# FormSectionResponseList
#
# An domain aware enumerable of FormSectionResponses. It enables
# a fluid api for querying form and subform data.
class FormSectionResponseList < ValueObject
  include Enumerable

  attr_accessor :responses
  attr_accessor :form_section

  def each
    responses.each do |result|
      yield FormSectionResponse.new(response: result, form_section: form_section)
    end
  end

  def field(name)
    map { |response| response.field(name) }
  end

  def subform(name)
    FormSectionResponseList.new(
      responses: field(name).flatten,
      form_section: subform_section(name)
    )
  end

  private

  def subform_section(name)
    return nil unless form_section

    FormSection
      .joins(subform_field: :form_section)
      .find_by(
        form_sections_fields: { id: form_section.id },
        fields: { name: name }
      )
  end
end
