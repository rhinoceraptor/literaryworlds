#!/bin/sh

set -e

export DATABASE=$1
export NEWDATABASE=$2

# Configure the database
echo -e "\n=============================================================="
echo -e "               Configuring LambdaMOO Database"
echo -e "==============================================================\n"
./configure_db

DB_BACKUP="$DATABASE.$(date +%F-%X)"
echo -e "\n=============================================================="
echo -e " Backing up $DATABASE to $DB_BACKUP"
echo -e "==============================================================\n"
# Create a backup of the old database
mv "$DATABASE" "$DATABASE.$DB_BACKUP"

# Move the edited database
mv "$NEWDATABASE" "$DATABASE"

# Start up LambdaMOO!
echo -e "\n=============================================================="
echo -e "                    Starting LambdaMOO"
echo -e "==============================================================\n"
exec ./moo "$DATABASE" "$NEWDATABASE"

