module Transitionable
  extend ActiveSupport::Concern
  include Sunspot::Rails::Searchable

  included do
    property :transitions, [Transition], :default => []


    def add_transition(transition_type, to_user_local, to_user_remote, to_user_agency, notes,
                       is_remote, is_remote_primero, user_name, service = "")
      transition = Transition.new(
                    :type => transition_type,
                    :to_user_local => to_user_local,
                    :to_user_remote => to_user_remote,
                    :to_user_agency => to_user_agency,
                    :transitioned_by => user_name,
                    :notes => notes, 
                    :is_remote => is_remote,
                    :is_remote_primero => is_remote_primero,
                    :service => service,
                    :created_at => DateTime.now)
      self.transitions << transition
      transition
    end
  end

end
