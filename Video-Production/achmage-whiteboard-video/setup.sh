#!/usr/bin/env sh
set -eu
export PYTHONUTF8=1
export PYTHONIOENCODING=utf-8
SKILL_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
VENV_PATH="$SKILL_ROOT/.venv"

if [ -d "$VENV_PATH" ] && [ ! -x "$VENV_PATH/bin/python" ]; then
  case "$VENV_PATH" in
    "$SKILL_ROOT"/*) rm -rf -- "$VENV_PATH" ;;
    *) echo "가상환경 경로가 안전하지 않습니다." >&2; exit 1 ;;
  esac
fi

if command -v uv >/dev/null 2>&1; then
  [ -d "$VENV_PATH" ] || uv venv "$VENV_PATH"
  uv pip install --python "$VENV_PATH/bin/python" -r "$SKILL_ROOT/requirements.lock"
else
  PYTHON_BIN=${PYTHON_BIN:-python3}
  [ -d "$VENV_PATH" ] || "$PYTHON_BIN" -m venv "$VENV_PATH"
  "$VENV_PATH/bin/python" -m pip install --upgrade pip
  "$VENV_PATH/bin/python" -m pip install -r "$SKILL_ROOT/requirements.lock"
fi

"$VENV_PATH/bin/python" "$SKILL_ROOT/scripts/whiteboard.py" doctor
