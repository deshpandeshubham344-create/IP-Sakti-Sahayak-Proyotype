@echo off
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload
pause
