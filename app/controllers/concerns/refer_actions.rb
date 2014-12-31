module ReferActions
  extend ActiveSupport::Concern

  def referral
    binding.pry
    # TODO referral magic happens here
    flash[:notice] = "Testing...1...2...3"
    
    #TODO make path generic
    redirect_to cases_path
  end
  
end