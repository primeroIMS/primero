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
      form_section: form_section&.fields&.find_by(name: name)&.subform
    )
  end
end
