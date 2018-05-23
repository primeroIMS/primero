module PotentialMatchHelper

  def potential_match_header_text
    result = ""
    if @potential_matches.present?
      id = ''
      if @tracing_request.present?
        id = text_to_identify_tracing_request(@tracing_request)
      elsif @child.present?
        id = @child.case_id_display
      end
      I18n.t('potential_matches.display', type: I18n.t("forms.record_types.#{@type}"), id: id)
    else
      I18n.t('potential_matches.empty')
    end
  end

  def text_to_identify_potential_match(potential_match)
    potential_match.short_id
  end

  def text_to_identify_potential_match_tracing_request(potential_match)
    potential_match.inquirer_id.last(7)
  end

  def mask_match_value(match, value)
    match.visible ? value : '***'
  end

end
