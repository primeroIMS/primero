class OptionsQueueStats
  def self.options_not_generated?
    options_dir = "#{Rails.root}/public/options"

    File.directory?(options_dir) && Dir.empty?(options_dir) ||
      !File.directory?(options_dir)
  end

  def self.jobs?
    job_count = 0

    if Rails.env.production?
      job_count = Delayed::Job.where(queue: 'options')
                              .where('handler ~ :job_class', job_class: 'GenerateLocationFilesJob').size
    elsif Rails.env.test?
      # Skip job if in test env
      job_count = 1
    end

    job_count.positive?
  end
end
