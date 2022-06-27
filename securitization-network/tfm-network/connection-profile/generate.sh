#!/bin/bash
./ccp-generate.sh
sleep 2
./ccp-generate_2.sh
sleep 2
node connection.js
