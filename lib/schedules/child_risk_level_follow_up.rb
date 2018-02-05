#The follow up process will create the corresponding flags starting with the registration date. 

#If registration date is older that the expiration window (2 weeks ago at this moment) it will
#use the current date. 

#Flags older than expiration window (2 weeks ago at this moment) it will be expired.

#The process will keep necessary flags according to the risk level, 4 flags for high, 
#2 flags for medium and 1 flag for low.

module ChildRiskLevelFollowUp
  HIGH_RISK_LEVEL = I18n.t("followup_reminders.high_risk_level")
  MEDIUM_RISK_LEVEL = I18n.t("followup_reminders.medium_risk_level")
  LOW_RISK_LEVEL = I18n.t("followup_reminders.low_risk_level")

  CHILD_STATUS_OPEN = I18n.t("followup_reminders.child_status_open")
  CHILD_STATUS_CLOSED = I18n.t("followup_reminders.child_status_closed")
  CHILD_STATUS_TRANSFERRED = I18n.t("followup_reminders.child_status_transferred")
  CHILD_STATUS_DUPLICATE = I18n.t("followup_reminders.child_status_duplicate")

  EXPIRED_MESSAGE = I18n.t("followup_reminders.system_generated_followup_unflag")
  CANCELLED_MESSAGE = I18n.t("followup_reminders.system_generated_followup_unflag_cancelled")
  FOLLOWUP_MESSAGE = I18n.t("followup_reminders.system_generated_followup_flag")

  #TODO all the next values should be parameterized, from where should be read?
  #Window where the follow up flags will expire.
  #don't use 2.weeks.ago returns the date with time we don't want the time.
  EXPIRATION_WINDOW = Date.today - 2.weeks

  #How many follow up will be created for risk levels.
  FOLLOWUP_COUNT = { HIGH_RISK_LEVEL => 4, MEDIUM_RISK_LEVEL => 2, LOW_RISK_LEVEL => 1 }
  #Distance between follow up for risk levels.
  INTERVALS = { HIGH_RISK_LEVEL => 1.week, MEDIUM_RISK_LEVEL => 2.weeks, LOW_RISK_LEVEL => 1.month }

  class << self
    def expiration_window
      EXPIRATION_WINDOW
    end

    def followup_count(risk_level)
      FOLLOWUP_COUNT[risk_level]
    end

    def interval(risk_level)
      INTERVALS[risk_level]
    end

    #calculate the initial date for the follow up flags.
    #if the start_date is older that the expiration window, it will use the current date.
    def get_starting_date(start_date, interval)
      ((start_date >= expiration_window) ? start_date : Date.today) + interval
    end

    #Returns true if the record never have been flagged for follow up.
    def never_flagged?(case_record)
      case_record.flags.select { |flag| flag.system_generated_followup }.blank?
    end

    #Returns how many follow up still valid.
    def count_followup_reminders(case_record)
      case_record.flags.count { |flag| flag.system_generated_followup && !flag.removed }
    end

    #Returns the last follow up date. 
    #The date can be the date of the last valid followup or the date of the last expired followup.
    def last_date_followup_reminders(case_record)
      #Lookup for valid flags to generate the next followup date.
      flag = case_record.flags.select{ |flag| flag.system_generated_followup && !flag.removed }.sort{ |a, b| b.date <=> a.date }.first
      if flag.present?
        flag.date
      else
        #Lookup the next date in the expired flags.
        flag = case_record.flags.select do |flag|
          flag.system_generated_followup && flag.unflag_message == EXPIRED_MESSAGE
        end.sort{ |a, b| b.date <=> a.date }.first
        flag.date if flag.present? && flag.date < Date.today
      end
    end

    #Create the corresponding follow up for the case_record.
    #number_of_followup is how many follow up will be created.
    #interval is the distance between follow up.
    #start_date is the potential initial date of the follow up.
    def create_followup_reminders_by_case(case_record, number_of_followup, interval, start_date)
      next_date = get_starting_date(start_date, interval)
      created_at = DateTime.now
      (1..number_of_followup).each do
        case_record.flags << Flag.new(:message => FOLLOWUP_MESSAGE, :date => next_date, :created_at => created_at, :system_generated_followup => true)
        next_date += interval
      end
      case_record.save!
    end

    #Create the next bunch of follow up based on the last follow up or if to much older use the current date.
    def create_next_followup_reminders_by_case(case_record, number_of_followup, interval)
      #get the valid follow up to find out of there is need to create the next bunch of follow up.
      count = count_followup_reminders(case_record)
      if count < number_of_followup
        #get the last date of follow up. Will potentially used for the next flags if not older that expiration window.
        start_date = last_date_followup_reminders(case_record)
        start_date = case_record.registration_date if start_date.nil?
        #Call the method for create the next bunch of follow up to keep the number_of_followup of follow up updated.
        create_followup_reminders_by_case(case_record, number_of_followup - count, interval, start_date)
      end
    end

    #Create the follow up reminders. It will create the follow up based on the risk_level,
    #the number_of_followup, interval and expiration window.
    def create_followup_reminders(risk_level, number_of_followup, interval)
      #retrieve the cases record by risk level for Open Cases.
      case_records = Child.by_generate_followup_reminders(:key => [CHILD_STATUS_OPEN, risk_level])
      case_records.all.each do |case_record|
        if never_flagged?(case_record)
          #Create follow up for cases that never have been flagged by reminders.
          create_followup_reminders_by_case(case_record, number_of_followup, interval, case_record.registration_date)
        else
          #Create the next bunch of reminders if needed.
          create_next_followup_reminders_by_case(case_record, number_of_followup, interval)
        end
      end
    end

    #Expire follow up reminders.
    def expire_followup_reminders
      Rails.logger.info "Verifying expired follow up reminders ..."
      #Retrieve cases that contains follow up reminders expired, based on the flag date field for open cases.
      case_records = Child.by_followup_reminders_scheduled(:startkey => [CHILD_STATUS_OPEN], :endkey => [CHILD_STATUS_OPEN, expiration_window])
      #The view may contains duplicated records because it filter by flags and record can have multiple flags.
      case_records.all.uniq(&:id).each do |case_record|
        case_record.flags.each do |flag|
          if flag.system_generated_followup && flag.date <= expiration_window
            #Mark expired flags.
            flag.unflag_message = EXPIRED_MESSAGE
            flag.removed = true
          end
        end
        case_record.save!
      end
    end

    #Cancel follow up reminders.
    def followup_reminders_cancel(case_records)
      case_records.all.uniq(&:id).each do |case_record|
        case_record.flags.each do |flag|
          if flag.system_generated_followup && !flag.removed
            #Mark cancelled flags.
            flag.unflag_message = CANCELLED_MESSAGE
            flag.removed = true
          end
        end
        case_record.save!
      end
    end

    #Cancel the followup reminders for invalid records.
    def invalid_records_cancel_followup_reminders_cancel
      Rails.logger.info "Verifying invalid records follow up reminders ..."
      case_records = Child.by_followup_reminders_scheduled_invalid_record
      followup_reminders_cancel(case_records)
    end

    #Cancel followup records for status other than Open, the user can change the status on the GUI.
    def other_status_records_cancel_followup_reminders_cancel
      [CHILD_STATUS_CLOSED, CHILD_STATUS_TRANSFERRED, CHILD_STATUS_DUPLICATE].each do |status|
        Rails.logger.info "Verifying #{status.downcase} cases follow up reminders ..."
        case_records = Child.by_followup_reminders_scheduled(:startkey => [status], :endkey => [status, {}])
        followup_reminders_cancel(case_records)
      end
    end

    #Create all the follow up reminders if needed.
    def create_all_followup_reminders
      [HIGH_RISK_LEVEL, MEDIUM_RISK_LEVEL, LOW_RISK_LEVEL].each do |risk_level|
        Rails.logger.info "Verifying #{risk_level.downcase} risk level follow up reminders ..."
        create_followup_reminders(risk_level, followup_count(risk_level), interval(risk_level))
      end
    end

    #Process the follow up reminders to expire or create new one.
    def process_followup_reminders
      invalid_records_cancel_followup_reminders_cancel
      other_status_records_cancel_followup_reminders_cancel
      expire_followup_reminders
      create_all_followup_reminders
    end

    def schedule(scheduler)
      scheduler.every("4h") do
        process_followup_reminders
      end
    end
  end
end
