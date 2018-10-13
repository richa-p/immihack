MATCH
  (predental:Skill {name: "pre-dental"}),
  (physiologicalsciences:Skill {name: "physiological-sciences"})

CREATE
  (predental)-[:CAN_LEARN {type: "learn"}]->(physiologicalsciences);