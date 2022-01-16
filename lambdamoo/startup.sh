#!/bin/sh

set -e

export DATABASE=$1
export NEWDATABASE=$2

ls -lA /db/
ls -lA

# Configure the database
echo -e "\n==============================================================="
echo -e "               Configuring LambdaMOO Database"
echo -e "===============================================================\n"
./configure_db

sleep 2
echo -e "\n==============================================================="
echo -e " Backing up $DATABASE to $DATABASE.$(date +%F-%X)"
echo -e "===============================================================\n"
# Create a backup of the old database
mv "$DATABASE" "$DATABASE.$(date +%F-%X)"

echo -e "\n==============================================================="
echo -e " Backing up $NEWDATABASE to $DATABASE"
echo -e "===============================================================\n"
# Move the edited database
mv "$NEWDATABASE" "$DATABASE"

# Start up LambdaMOO!
echo -e "\n==============================================================="
echo -e "                    Starting LambdaMOO"
echo -e "===============================================================\n"
exec ./moo "$DATABASE" "$NEWDATABASE"

