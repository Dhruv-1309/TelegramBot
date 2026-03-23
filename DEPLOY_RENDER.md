# Render 24/7 Deployment (Background Worker)

## 1) Prepare repository

- Push this project to GitHub.
- Ensure `.env` is NOT committed.

## 2) Create Render worker

- Go to Render dashboard.
- Create **New +** -> **Background Worker**.
- Connect your GitHub repo.
- Render will auto-detect settings from `render.yaml`.

## 3) Configure environment variables

Set these in Render service settings:

- `BOT_TOKEN`
- `MONGO_URI`

## 4) Deploy

- Trigger deploy.
- Confirm logs show:
  - `MongoDB Connected`
  - no Telegram `409 Conflict` errors

## 5) Prevent conflicts

- Run exactly one bot instance.
- Stop local `node index.js` after cloud deploy.
- Do not run the same bot token in multiple places.

## 6) Verify bot

- `/start`
- `/status`
- `/timecheck`

## Notes

- For reliable 24/7 operation, keep worker on a non-sleeping plan.
- If `409 Conflict` appears, another instance with same token is still running.
