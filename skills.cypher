CREATE
  (:Skill {name: "pre-dental"}),
  (:Skill {name: "biological-sciences"}),
  (:Skill {name: "physiological-sciences"}),
  (:Skill {name: "dental"}),
  (:Skill {name: "pre-medical"}),
  (:Skill {name: "medical"});

MATCH
  (predental:Skill {name: "pre-dental"}),
  (biologicalsciences:Skill {name: "biological-sciences"}),
  (physiologicalsciences:Skill {name: "physiological-sciences"})

CREATE
  (predental)-[:CAN_LEARN {type: "learn"}]->(biologicalsciences),
  (biologicalsciences)-[:CAN_LEARN {type: "learn"}]->(physiologicalsciences);

  