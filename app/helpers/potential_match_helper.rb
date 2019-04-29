module PotentialMatchHelper

  def potential_match_header_text
    if @potential_matches.present?
      I18n.t('potential_matches.display', type: I18n.t("forms.record_types.#{@type}"), id: @display_id)
    elsif params[:match].blank?
      I18n.t('potential_matches.empty')
    end
  end

  def text_to_identify_potential_match(potential_match)
    potential_match.short_id
  end

  def text_to_identify_potential_match_tracing_request(potential_match)
    potential_match.inquirer_id.last(7)
  end

  def comparison_symbol(comparison)
    if comparison == PotentialMatch::VALUE_MATCH
      content_tag(:span, '&#10004;'.html_safe, class: 'value-match')
    elsif comparison == PotentialMatch::VALUE_MISMATCH
      content_tag(:span, '&#10008;'.html_safe, class: 'value-mismatch')
    else
      '-'
    end
  end

  def comparison_value(value)
    return '-' if value.blank?
    value.is_a?(Array) ? value.join(',') : value
  end

  def mark_case_matched_to_trace(potential_match)
    if potential_match.case_and_trace_matched?
      'case-and-trace-matched'
    else
      ''
    end
  end

end
