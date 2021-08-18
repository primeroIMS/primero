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
      if result.is_a?(FormSectionResponse)
        yield result
      else
        yield FormSectionResponse.new(response: result, form_section: form_section)
      end
    end
  end

  def select(&block)
    FormSectionResponseList.new(
      responses: map.select(&block),
      form_sction: form_section
    )
  end

  def field(name)
    map { |response| response.field(name) }
  end

  def subform(name)
    FormSectionResponseList.new(
      responses: field(name).compact.flatten,
      form_section: subform_section(name)
    )
  end

  private

  def subform_section(name)
    return nil unless form_section

    # Take adavantage of eager loaded fields and subforms
    form_section.fields.select { |f| f.name.to_sym == name }.first&.subform
  end
end
