class FormSectionResponse < ValueObject
  attr_accessor :response
  attr_accessor :form_section

  def fields
    form_section&.fields || []
  end

  def mandatory_fields
    @mandatory_fields ||= fields.select(&:mandatory_for_completion?)
  end

  def complete?
    return false unless response
    return false if mandatory_fields.empty?

    mandatory_fields.all? { |f| field(f.name).present? }
  end

  def field(name)
    return nil unless response

    response[name.to_s]
  end

  def subform(name)
    FormSectionResponseList.new(
      responses: field(name).flatten,
      form_section: form_section&.fields&.find_by(name: name)&.subform
    )
  end
end
