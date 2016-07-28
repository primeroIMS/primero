Location.create! placename: "South Sudan", admin_level: 0, type: "country"

Location.create! placename: "Bahr el Ghazal", type: "region", hierarchy: ["South Sudan"]
Location.create! placename: "Northern Bahr el Ghazal", type: "region", hierarchy: ["South Sudan", "Bahr el Ghazal"]
Location.create! placename: "Western Bahr el Ghazal", type: "region", hierarchy: ["South Sudan", "Bahr el Ghazal"]
Location.create! placename: "Lakes", type: "region", hierarchy: ["South Sudan", "Bahr el Ghazal"]
Location.create! placename: "Warrap", type: "region", hierarchy: ["South Sudan", "Bahr el Ghazal"]

Location.create! placename: "Equatoria", type: "region", hierarchy: ["South Sudan"]
Location.create! placename: "Western Equatoria", type: "region", hierarchy: ["South Sudan", "Equatoria"]
Location.create! placename: "Central Equatoria", type: "region", hierarchy: ["South Sudan", "Equatoria"]
Location.create! placename: "Eastern Equatoria", type: "region", hierarchy: ["South Sudan", "Equatoria"]

Location.create! placename: "Greater Upper Nile", type: "state", hierarchy: ["South Sudan"]
Location.create! placename: "Jonglei", type: "state", hierarchy: ["South Sudan", "Greater Upper Nile"]
Location.create! placename: "Unity", type: "state", hierarchy: ["South Sudan", "Greater Upper Nile"]
Location.create! placename: "Upper Nile", type: "state", hierarchy: ["South Sudan", "Greater Upper Nile"]

Location.create! placename: "Juba", type: "city", hierarchy: ["South Sudan", "Equatoria", "Central Equatoria", "Juba"]