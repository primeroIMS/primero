module ErrorsHelper
  # TODO Discard after UIUX refactor
  def error_messages_for(object, **options)
    return unless object.respond_to?(:errors) && object.errors.any?
    model_name = object.try(:class).try(:name)
    header_message = if object.errors.count.eql?(1)
                       I18n.t('errors.template.header.one', model: model_name)
                     else
                       I18n.t('errors.template.header.other', count: object.errors.length, model: model_name)
                     end
    header_message = options[:header_message] if options[:header_message].present?
    message = options[:message].present? ? options[:message] : I18n.t('errors.template.header.body')

    content = ""
    content << content_tag(:h2, header_message)
    content << content_tag(:p, message)
    errors_list = object.errors.full_messages.map { |message| content_tag(:li, message) }.join("\n")
    content << content_tag(:ul, errors_list.html_safe)
    content_tag(:div, content.html_safe, :id => "errorExplanation", :class => "errorExplanation form-errors")
  end
end
