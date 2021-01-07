module FormAndFieldHelper

  def form(id, fields)
    FormSection.create_or_update!(
      unique_id: id,
      parent_form: 'case',
      name_en: id.to_s.split('_').map(&:capitalize).join(' '),
      description_en: id.to_s.split('_').map(&:capitalize).join(' '),
      fields: fields
    )
  end

  def field(id, config = {})
    Field.new(config.merge(
      name: id,
      display_name_en: id.to_s.split('_').map(&:capitalize).join(' ')
    ))
  end
end
