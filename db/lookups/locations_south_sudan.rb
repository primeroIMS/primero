Location.create! name: "South Sudan", type: "country"

Location.create! name: "Bahr el Ghazal", type: "region", hierarchy: ["South Sudan"]
Location.create! name: "Northern Bahr el Ghazal", type: "region", hierarchy: ["South Sudan", "Bahr el Ghazal"]
Location.create! name: "Western Bahr el Ghazal", type: "region", hierarchy: ["South Sudan", "Bahr el Ghazal"]
Location.create! name: "Lakes", type: "region", hierarchy: ["South Sudan", "Bahr el Ghazal"]
Location.create! name: "Warrap", type: "region", hierarchy: ["South Sudan", "Bahr el Ghazal"]

Location.create! name: "Equatoria", type: "region", hierarchy: ["South Sudan"]
Location.create! name: "Western Equatoria", type: "region", hierarchy: ["South Sudan", "Equatoria"]
Location.create! name: "Central Equatoria", type: "region", hierarchy: ["South Sudan", "Equatoria"]
Location.create! name: "Eastern Equatoria", type: "region", hierarchy: ["South Sudan", "Equatoria"]

Location.create! name: "Greater Upper Nile", type: "state", hierarchy: ["South Sudan"]
Location.create! name: "Jonglei", type: "state", hierarchy: ["South Sudan", "Greater Upper Nile"]
Location.create! name: "Unity", type: "state", hierarchy: ["South Sudan", "Greater Upper Nile"]
Location.create! name: "Upper Nile", type: "state", hierarchy: ["South Sudan", "Greater Upper Nile"]

Location.create! name: "Juba", type: "city", hierarchy: ["South Sudan", "Equatoria", "Central Equatoria", "Juba"]