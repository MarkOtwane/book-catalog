#!/bin/bash

echo "Set up the database"

#create database
psql -U postgres -h localhost -c "CREATE DATABASE bookcatalog"

#RUN migrations
psql -U postgres -h localhost -d bookcatalog -f src/database/migrations/schema.sql

echo "Database setup complete"

echo "You can run: npm run start:dev"