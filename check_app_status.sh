#!/usr/bin/env bash

check() {
for (( i=1; i<=5; i++ ))
do
   status=$(curl -s --head http://172.17.0.4:30082/ | grep 200 | awk '{print $2}')
   if [[ ${status} -eq "200" ]];
   then echo "Running" && sleep 5;
   else
   echo "Failed to start "
   exit 1
   fi
done
echo "Successfully started"
}

check
