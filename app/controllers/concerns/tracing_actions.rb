module TracingActions
  extend ActiveSupport::Concern

  included do
    before_filter :load_tracing_request, :only => [:index]
  end

  def load_tracing_request
    if params[:match].present?
      # Expect match input to be in format <tracing request id>::<tracing request subform unique id>
      tracing_request_id = params[:match].split("::").first
      subform_id = params[:match].split("::").last
      @tracing_request = TracingRequest.get(tracing_request_id) if tracing_request_id.present?
      if @tracing_request.present? && subform_id.present?
        @match_request = @tracing_request.tracing_request_subform_section.select{|tr| tr.unique_id == subform_id}.first
        
        @match_criteria = match_criteria(@tracing_request, @match_request) if @match_request.present?
      end
    end
  end

  private

  def match_criteria(tracing_request, match_request)
    match_criteria = {}

    match_criteria[:name] = match_request.name
    match_criteria[:name_nickname] = match_request.name_nickname
    match_criteria[:sex] = match_request.sex
    match_criteria[:date_of_birth] = match_request.date_of_birth

    match_criteria[:language] = tracing_request.relation_language
    match_criteria[:religion] = tracing_request.relation_religion
    match_criteria[:nationality] = tracing_request.relation_nationality

    match_criteria[:ethnicity] = []
    match_criteria[:ethnicity].push(tracing_request.relation_ethnicity, tracing_request.relation_sub_ethnicity1, tracing_request.relation_sub_ethnicity2)
    match_criteria[:ethnicity].uniq!
    match_criteria[:ethnicity].compact!

    return match_criteria
  end
end
