#!/usr/bin/env bash

# delete everything and add some sample users/locations/entitlements
cat ./skills.cypher | cypher-shell -u neo4j -p $1 --format plain
