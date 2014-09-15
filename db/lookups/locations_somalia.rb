#Country
Location.create! placename: "Somalia", type: "country"

#Autonomous Regions
Location.create! placename: "Somaliland", type: "other", hierarchy: ["Somalia"]
Location.create! placename: "Puntland", type: "other", hierarchy: ["Somalia", "Nugal"]
Location.create! placename: "Galmudug", type: "other", hierarchy: ["Somalia"]
Location.create! placename: "Jubaland", type: "other", hierarchy: ["Somalia"]

#Regions
Location.create! placename:"Lower Juba", type: "region", hierarchy: ["Somalia", "Jubaland"]
Location.create! placename:"Middle Juba", type: "region", hierarchy: ["Somalia", "Jubaland"]
Location.create! placename:"Gedo", type: "region", hierarchy: ["Somalia", "Jubaland"]
Location.create! placename:"Bay", type: "region", hierarchy: ["Somalia"]
Location.create! placename:"Bakool", type: "region", hierarchy: ["Somalia"]
Location.create! placename:"Lower Shebelle", type: "region", hierarchy: ["Somalia"]
Location.create! placename:"Banaadir", type: "region", hierarchy: ["Somalia"]
Location.create! placename:"Middle Shebelle", type: "region", hierarchy: ["Somalia"]
Location.create! placename:"Hiran", type: "region", hierarchy: ["Somalia"]
Location.create! placename:"Galguduud", type: "region", hierarchy: ["Somalia", "Galmudug"]
Location.create! placename:"Mudug", type: "region", hierarchy: ["Somalia", "Galmudug"]
Location.create! placename:"Nugal", type: "region", hierarchy: ["Somalia"]
Location.create! placename:"Bari", type: "region", hierarchy: ["Somalia"]
Location.create! placename:"Sool", type: "region", hierarchy: ["Somalia", "Somaliland"]
Location.create! placename:"Sanaag", type: "region", hierarchy: ["Somalia", "Somaliland"]
Location.create! placename:"Togdheer", type: "region", hierarchy: ["Somalia", "Somaliland"]
Location.create! placename:"Woqooyi Galbeed", type: "region", hierarchy: ["Somalia", "Somaliland"]
Location.create! placename:"Awdal", type: "region", hierarchy: ["Somalia", "Somaliland"]

Location.create! placename: "Mogadishu", type: "city", hierarchy: ["Somalia", "Banaadir"]
Location.create! placename: "Kismayo", type: "city", hierarchy: ["Somalia", "Jubaland", "Lower Juba"]
