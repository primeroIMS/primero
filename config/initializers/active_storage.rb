# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# This expires the underlying service redirect urls. The URLs are public?!
# TODO: Depending on how the Azure Blob Service is set up, we may do a blanket
# forbid on all ActiveStorage URLSs and create new proxy controllers for blobs.

ActiveStorage.service_urls_expire_in = 60.seconds
