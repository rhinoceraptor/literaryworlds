#!/usr/bin/env bash

while true; do
  read -rep $'This will delete your existing enCore database, are you sure?\n> ' yn
  case $yn in
    [Yy]* ) rm -rf encore/* db/*; break;;
    [Nn]* ) exit;;
    * ) echo "Please answer yes or no.";;
  esac
done

echo "Cloning stock enCore database..."
git clone --quiet --depth=1 https://github.com/rhinoceraptor/enCoreV4.git encore_temp
echo "Placing files..."
mv encore_temp/enCore.db* db/
mv encore_temp/* encore/
echo "Cleaning up temp files..."
rm -rf encore_temp
echo "Done!"
