#Country
Location.create! name: "Somalia", type: "country"

#Autonomous Regions
Location.create! name: "Somaliland", type: "other", hierarchy: ["Somalia"]
Location.create! name: "Puntland", type: "other", hierarchy: ["Somalia", "Nugal"]
Location.create! name: "Galmudug", type: "other", hierarchy: ["Somalia"]
Location.create! name: "Jubaland", type: "other", hierarchy: ["Somalia"]

#Regions
Location.create! name:"Lower Juba", type: "region", hierarchy: ["Somalia", "Jubaland"]
Location.create! name:"Middle Juba", type: "region", hierarchy: ["Somalia", "Jubaland"]
Location.create! name:"Gedo", type: "region", hierarchy: ["Somalia", "Jubaland"]
Location.create! name:"Bay", type: "region", hierarchy: ["Somalia"]
Location.create! name:"Bakool", type: "region", hierarchy: ["Somalia"]
Location.create! name:"Lower Shebelle", type: "region", hierarchy: ["Somalia"]
Location.create! name:"Banaadir", type: "region", hierarchy: ["Somalia"]
Location.create! name:"Middle Shebelle", type: "region", hierarchy: ["Somalia"]
Location.create! name:"Hiran", type: "region", hierarchy: ["Somalia"]
Location.create! name:"Galguduud", type: "region", hierarchy: ["Somalia", "Galmudug"]
Location.create! name:"Mudug", type: "region", hierarchy: ["Somalia", "Galmudug"]
Location.create! name:"Nugal", type: "region", hierarchy: ["Somalia"]
Location.create! name:"Bari", type: "region", hierarchy: ["Somalia"]
Location.create! name:"Sool", type: "region", hierarchy: ["Somalia", "Somaliland"]
Location.create! name:"Sanaag", type: "region", hierarchy: ["Somalia", "Somaliland"]
Location.create! name:"Togdheer", type: "region", hierarchy: ["Somalia", "Somaliland"]
Location.create! name:"Woqooyi Galbeed", type: "region", hierarchy: ["Somalia", "Somaliland"]
Location.create! name:"Awdal", type: "region", hierarchy: ["Somalia", "Somaliland"]

Location.create! name: "Mogadishu", type: "city", hierarchy: ["Somalia", "Banaadir"]
Location.create! name: "Kismayo", type: "city", hierarchy: ["Somalia", "Jubaland", "Lower Juba"]
