#!/usr/bin/env bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
BACKEND_DIR="$SCRIPT_DIR/backend"

GIT_HOME="${GIT_HOME:-/c/Program Files/Git}"
MINTTY="$GIT_HOME/usr/bin/mintty.exe"
BASH_EXE="$GIT_HOME/bin/bash.exe"

if [ ! -f "$MINTTY" ] || [ ! -f "$BASH_EXE" ]; then
  GIT_HOME="/c/Program Files (x86)/Git"
  MINTTY="$GIT_HOME/usr/bin/mintty.exe"
  BASH_EXE="$GIT_HOME/bin/bash.exe"
fi

if [ ! -f "$MINTTY" ] || [ ! -f "$BASH_EXE" ]; then
  echo "Git Bash terminal files were not found."
  echo "Set GIT_HOME to your Git installation path and run this script again."
  echo "Example:"
  echo "GIT_HOME='/c/Program Files/Git' bash start_project.sh"
  exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
  echo "Frontend folder not found: $FRONTEND_DIR"
  exit 1
fi

if [ ! -d "$BACKEND_DIR" ]; then
  echo "Backend folder not found: $BACKEND_DIR"
  exit 1
fi

"$MINTTY" --title "VectorShift Backend" "$BASH_EXE" -lc "cd '$BACKEND_DIR' && python -m uvicorn main:app --reload; exec bash" &
"$MINTTY" --title "VectorShift Frontend" "$BASH_EXE" -lc "cd '$FRONTEND_DIR' && npm start; exec bash" &

echo "Started backend and frontend in separate Git Bash windows."
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:3000"
