#Country
Location.create! placename: "Uganda", type: "country"

Location.create! placename:"Central Region", type: "region", hierarchy: ["Uganda"]
Location.create! placename:"Eastern Region", type: "region", hierarchy: ["Uganda"]
Location.create! placename:"Western Region", type: "region", hierarchy: ["Uganda"]
Location.create! placename:"Northern Region", type: "region", hierarchy: ["Uganda"]

Location.create! placename:"Kampala", type: "city", hierarchy: ["Uganda", "Central Region"]
Location.create! placename:"Entebbe", type: "city", hierarchy: ["Uganda", "Central Region"]