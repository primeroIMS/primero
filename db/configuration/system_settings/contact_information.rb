unless ContactInformation.current
  ContactInformation.create(name: 'administrator')
end