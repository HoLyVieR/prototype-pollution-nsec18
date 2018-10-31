#!/bin/bash
for var in "$@"
do
    timeout 10 nodejs find-vuln.js "$var" 2>/dev/null | grep -aPe "^Detected : " 
done
