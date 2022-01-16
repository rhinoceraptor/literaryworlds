#!/bin/sh

set -e

export DATABASE=$1
export NEWDATABASE=$2

ls -lA /db/

# Configure the database
echo -e "\n==============================================================="
echo -e "               Configuring LambdaMOO Database"
echo -e "===============================================================\n"
./configure_db

ls -lA /db/
ls -lA "$DATABASE"

DB_BACKUP="$DATABASE.$(date +%F-%X)"
ls -lA "$DATABASE"
echo -e "\n==============================================================="
echo -e " Backing up $DATABASE to $DB_BACKUP"
echo -e "===============================================================\n"
# Create a backup of the old database
mv -i "$DATABASE" "$DATABASE.$DB_BACKUP"

echo -e "\n==============================================================="
echo -e " Backing up $NEWDATABASE to $DATABASE"
echo -e "===============================================================\n"
# Move the edited database
mv -i "$NEWDATABASE" "$DATABASE"

# Start up LambdaMOO!
echo -e "\n==============================================================="
echo -e "                    Starting LambdaMOO"
echo -e "===============================================================\n"
exec ./moo "$DATABASE" "$NEWDATABASE"

