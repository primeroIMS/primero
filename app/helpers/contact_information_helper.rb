module ContactInformationHelper
  def show_contact_field field, link=false
    value = link ? "<a href='#{@contact_information[field]}'>#{@contact_information[field]}</a>" : @contact_information[field]
    return raw "<p id='contact_info_#{field}'><strong>#{t("contact.field."+field.to_s)}:</strong> #{value}</p>"
  end
end