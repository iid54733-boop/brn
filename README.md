# BRNTEAM Chill Room — After Dark edition

Personal, responsive chill-room site with complete Arabic/English UI, animated GIF background support, social profile cards, a local clock, and looping audio controls.

## Files
- `index.html` — site structure and social links.
- `style.css` — design, responsive layouts, animation, and GIF background layers.
- `script.js` — language toggle, clock, copy Discord username, autoplay attempt, audio loop, and controls.
- `assets/rainy-window.jpeg` — static fallback background.
- `assets/scene.gif` — **add the GIF you provided here** for a permanent animated background.
- `assets/after-dark.mp3` — **add the converted MP3 here** for permanent local playback.

## Important: supplied Discord attachment URLs
The MP4 and GIF links shared in chat are signed CDN attachment links that expire. This execution environment could not download the attachments (the CDN host could not be resolved), so I could not actually convert the MP4 into an MP3 or bundle the GIF. The page contains temporary fallback URLs for the attachments, but those may stop working when Discord expires the signatures.

For a complete offline/reliable bundle, upload both original files directly into the chat as file attachments (not links), or manually place them in `assets/` using the filenames above. Then convert the MP4 to MP3 with:

```bash
ffmpeg -i assets/after-dark-source.mp4 -vn -codec:a libmp3lame -q:a 2 assets/after-dark.mp3
```

If converting locally, put the downloaded source as `assets/after-dark-source.mp4`; the final site uses `assets/after-dark.mp3`.

## Run and deploy
Open `index.html` in a modern browser, or upload the entire folder to Cloudflare Pages or another static host. No build step is required. For the Discord username copy button and best browser compatibility, serve from localhost or HTTPS.

## Audio behavior
The site attempts audible autoplay and loops the audio. Modern browsers commonly block autoplay with sound; if that happens, click the play button. Audio is set to a moderate volume of 36%. The MP4 attachment URL is a temporary fallback only; a local MP3 is recommended for production.

## Accounts
- Discord username (copy): `.a2x_`
- Discord server: https://discord.gg/scw8jQkwAS
- TikTok: https://www.tiktok.com/@i4_zc
- GitHub: https://github.com/iid54733-boop
- Telegram: https://t.me/xs2xao
- YouTube: https://www.youtube.com/@X-XNM-M
