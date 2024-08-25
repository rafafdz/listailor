#!/bin/bash
cd backend
# TODO: Check if another deploy is running. In that case, fail
# Report any deploy error to slack
# Always run migrations in staging
# Send warning of pending migration to slack in production
cmd="sudo docker compose"

$cmd stop
$cmd build
$cmd up -d