#The follow up process will create the corresponding flags starting with the registration date. 

#If registration date is older that the expiration window (2 weeks ago at this moment) it will
#use the current date. 

#Flags older than expiration window (2 weeks ago at this moment) it will be expired.

#The process will keep necessary flags according to the risk level, 4 flags for high, 
#2 flags for medium and 1 flag for low.

module ChildRiskLevelFollowUp
  HIGH_RISK_LEVEL = "High"
  MEDIUM_RISK_LEVEL = "Medium"
  LOW_RISK_LEVEL = "Low"

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
    def last_date_followup_reminders(case_record)
      case_record.flags.select{ |flag| flag.system_generated_followup }.sort{ |a, b| b.date <=> a.date }.first.date
    end

    #Create the corresponding follow up for the case_record.
    #number_of_followup is how many follow up will be created.
    #interval is the distance between follow up.
    #start_date is the potential initial date of the follow up.
    def create_followup_reminders_by_case(case_record, number_of_followup, interval, start_date)
      flags = []
      next_date = get_starting_date(start_date, interval)
      created_at = DateTime.now
      (1..number_of_followup).each do
        flags << Flag.new(:message => I18n.t("messages.system_generated_followup_flag"), :date => next_date, :created_at => created_at, :system_generated_followup => true)
        next_date += interval
      end
      case_record.flags.concat(flags)
      case_record.save!
    end

    #Create the next bunch of follow up based on the last follow up or if to much older use the current date.
    def create_next_followup_reminders_by_case(case_record, number_of_followup, interval)
      #get the valid follow up to find out of there is need to create the next bunch of follow up.
      count = count_followup_reminders(case_record)
      if count < number_of_followup
        #get the last date of follow up. Will potentially used for the next flags if not older that expiration window.
        last_date_flag = last_date_followup_reminders(case_record)
        #Call the method for create the next bunch of follow up to keep the number_of_followup of follow up updated.
        create_followup_reminders_by_case(case_record, number_of_followup - count, interval, last_date_flag)
      end
    end

    #Create the follow up reminders. It will create the follow up based on the risk_level,
    #the number_of_followup, interval and expiration window.
    def create_followup_reminders(risk_level, number_of_followup, interval)
      #retrieve the cases record by risk level
      case_records = Child.by_generate_followup_reminders(:key => risk_level)
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
      #Retrieve cases that contains follow up reminders expired, based on the flag date field.
      case_records = Child.by_followup_reminders_scheduled(:endkey => expiration_window)
      #The view may contains duplicated records because it filter by flags and record can have multiple flags.
      case_records.all.uniq(&:id).each do |case_record|
        case_record.flags.each do |flag|
          if flag.system_generated_followup && flag.date <= expiration_window
            #Mark expired flags.
            flag.unflag_message = I18n.t("messages.system_generated_followup_unflag")
            flag.removed = true
          end
        end
        case_record.save!
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
