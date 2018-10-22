if OptionsQueueStats.options_not_generated?
  OptionsJob.perform_now
end