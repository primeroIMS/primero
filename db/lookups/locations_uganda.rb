#Country
Location.create! name: "Uganda", type: "country"

Location.create! name:"Central Region", type: "region", hierarchy: ["Uganda"]
Location.create! name:"Eastern Region", type: "region", hierarchy: ["Uganda"]
Location.create! name:"Western Region", type: "region", hierarchy: ["Uganda"]
Location.create! name:"Northern Region", type: "region", hierarchy: ["Uganda"]

Location.create! name:"Kampala", type: "city", hierarchy: ["Uganda", "Central Region"]
Location.create! name:"Entebbe", type: "city", hierarchy: ["Uganda", "Central Region"]