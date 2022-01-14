#!/usr/bin/env bash

while true; do
  read -p "This will delete your existing enCore database, are you sure?" yn
  case $yn in
    [Yy]* ) rm -rf encore/* db/*; break;;
    [Nn]* ) exit;
    * ) echo "Please answer yes or no.";;
  esac
done

git clone --depth=1 https://github.com/rhinoceraptor/enCoreV4.git encore_temp
mv encore_temp/enCore.db* db/
mv encore_temp/* encore/
rm -rf encore_temp
