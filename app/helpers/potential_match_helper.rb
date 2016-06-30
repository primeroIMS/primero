module PotentialMatchHelper
  def text_to_identify_potential_match potential_match
    "#{potential_match.short_id}"
  end

  def text_to_identify_potential_match_child potential_match
    "#{potential_match.case_id.last 7}"
  end

  def text_to_identify_potential_match_tracing_request potential_match
    "#{potential_match.tr_id.last 7}"
  end

end
