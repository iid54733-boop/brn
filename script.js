(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const audio = $("bgAudio");
  const MP4_FALLBACK = "https://cdn.discordapp.com/attachments/1539301953262329997/1560228301673472051/vidssave.com_Mr.Kitty_-_After_Dark_360P.mp4?ex=6ad1f356&is=6ad0a1d6&hm=93fa2252664ecc8f1097ee50baa30b20e61c24cf3112c392c69e484be5331eea&";
  let playing = false;
  let english = false;
  let toastTimer;
  let lastClockStamp = "";
  let usingFallback = false;
  const copy = {
    ar: {
      topStatus:"ليل هادئ، على مهل", pillText:"مساحة شخصية · الإصدار 02", eyebrow:"أهلًا بك في مساحتي",
      heroTitle:"خفّف السرعة.<br><em>الدنيا تقدر تنتظر.</em>",
      heroDescription:"مطر خلف النافذة، أضواء بعيدة، وأغنية After Dark تخلي اللحظة أخف. خذ راحتك، المكان لك.",
      play:"شغّل الموسيقى", pause:"إيقاف الموسيقى", socialCta:"خلّنا نتواصل", trackTitle:"Mr.Kitty — After Dark",
      trackSubtitle:"تشغيل محلي · تكرار مستمر", weatherText:"أجواء ممطرة", littleReminder:"تذكير صغير",
      quoteText:"مو لازم تنجز كل شيء اليوم.<br>أحيانًا الراحة هي كل المطلوب.", clockCaption:"وقتك المحلي", clockDate:"خذ الليلة بهدوء",
      musicCaption:"الموسيقى الحالية", miniTrackTitle:"Mr.Kitty — After Dark", musicHint:"اضغط تشغيل لبدء الاستماع",
      connectEyebrow:"روابط مباشرة", socialTitle:"تلقاني <em>هنا.</em>", socialDescription:"حساباتي ومجتمعي — اختَر المنصة اللي تناسبك.",
      serverName:"سيرفر دسكورد", joinTag:"انضم للمجتمع", discordAccountTitle:"حسابي في دسكورد", copyTag:"نسخ الاسم",
      watchTag:"شوف المقاطع", codeTag:"مشاريعي البرمجية", messageTag:"راسلني مباشرة", subTag:"اشترك بالقناة",
      footerText:"مساحة بسيطة، هدوء أكثر.", ready:"جاهزة", playing:"تعمل الآن", pausedToast:"تم إيقاف الموسيقى.",
      startToast:"تم طلب تشغيل الموسيقى. إذا منعها المتصفح تلقائيًا، اضغط تشغيل مرة أخرى.",
      copied:"تم نسخ اسم دسكورد.", copyFailed:"اسم دسكورد: .a2x_", musicError:"ما قدرنا نشغّل الملف. أعد رفع MP4 وGIF داخل مجلد assets كما هو موضح في README."
    },
    en: {
      topStatus:"Slow night, no rush", pillText:"Personal space · Vol. 02", eyebrow:"Welcome to my little corner",
      heroTitle:"Slow it down.<br><em>The world can wait.</em>",
      heroDescription:"Rain on the window, distant city lights, and Mr.Kitty's After Dark to make the moment feel lighter. Make yourself at home.",
      play:"Play the music", pause:"Pause music", socialCta:"Find me online", trackTitle:"Mr.Kitty — After Dark",
      trackSubtitle:"Local audio · Continuous loop", weatherText:"Rainy ambience", littleReminder:"A LITTLE REMINDER",
      quoteText:"You don't have to finish everything today.<br>Sometimes rest is all you need.", clockCaption:"YOUR LOCAL TIME", clockDate:"Take the night slowly",
      musicCaption:"NOW PLAYING", miniTrackTitle:"Mr.Kitty — After Dark", musicHint:"Press play to start listening",
      connectEyebrow:"DIRECT LINKS", socialTitle:"Find me <em>here.</em>", socialDescription:"My accounts and community — choose your corner.",
      serverName:"Discord server", joinTag:"Join the community", discordAccountTitle:"My Discord account", copyTag:"Copy username",
      watchTag:"Watch clips", codeTag:"My projects", messageTag:"Message me", subTag:"Subscribe",
      footerText:"A little space for a little more calm.", ready:"READY", playing:"PLAYING", pausedToast:"Music paused.",
      startToast:"Playback requested. If your browser blocks autoplay, press play once more.",
      copied:"Discord username copied.", copyFailed:"Discord username: .a2x_", musicError:"Couldn't play the file. Add the MP4 and GIF files to assets as explained in README."
    }
  };
  const translationIds = ["topStatus","pillText","eyebrow","heroDescription","socialCta","trackTitle","trackSubtitle","weatherText","littleReminder","quoteText","clockCaption","clockDate","musicCaption","miniTrackTitle","musicHint","connectEyebrow","socialTitle","socialDescription","serverName","joinTag","discordAccountTitle","copyTag","watchTag","codeTag","messageTag","subTag","footerText"];

  function showToast(message) {
    $("toast").textContent = message;
    $("toast").classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $("toast").classList.remove("show"), 3800);
  }
  function currentCopy() { return copy[english ? "en" : "ar"]; }
  function updatePlayerUi() {
    const c = currentCopy();
    $("musicLabel").textContent = playing ? c.pause : c.play;
    $("mainPlayIcon").textContent = playing ? "Ⅱ" : "▶";
    $("miniPlay").textContent = playing ? "Ⅱ" : "▶";
    $("miniPlay").setAttribute("aria-label", playing ? c.pause : c.play);
    $("equalizer").classList.toggle("is-playing", playing);
    $("trackState").textContent = playing ? c.playing : c.ready;
    $("musicHint").textContent = playing ? (english ? "Playing locally · After Dark" : "يتم التشغيل الآن · After Dark") : c.musicHint;
  }
  function setPlaying(value) { playing = value; updatePlayerUi(); }

  function tryFallback() {
    if (usingFallback) {
      showToast(currentCopy().musicError);
      return;
    }
    usingFallback = true;
    audio.src = MP4_FALLBACK;
    audio.load();
    audio.play().then(() => setPlaying(true)).catch(() => {
      setPlaying(false);
      showToast(currentCopy().musicError);
    });
  }

  async function toggleMusic() {
    try {
      if (playing && !audio.paused) {
        audio.pause();
        setPlaying(false);
        showToast(currentCopy().pausedToast);
        return;
      }
      if (!audio.src || (!audio.currentSrc && audio.readyState === 0)) {
        audio.src = "assets/after-dark.mp3";
        audio.load();
      }
      await audio.play();
      setPlaying(true);
      showToast(currentCopy().startToast);
    } catch (err) {
      if (err && (err.name === "NotSupportedError" || err.name === "NetworkError")) {
        tryFallback();
      } else {
        showToast(currentCopy().startToast);
      }
    }
  }
  $("musicBtn").addEventListener("click", toggleMusic);
  $("miniPlay").addEventListener("click", toggleMusic);
  audio.addEventListener("play", () => setPlaying(true));
  audio.addEventListener("pause", () => setPlaying(false));
  audio.addEventListener("ended", () => { if (audio.loop) setPlaying(true); });
  audio.addEventListener("error", () => {
    // Use the linked MP4 only as a temporary fallback when the permanent local MP3 is absent.
    if (!usingFallback && audio.currentSrc && audio.currentSrc.includes("after-dark.mp3")) tryFallback();
    else if (usingFallback) showToast(currentCopy().musicError);
  });
  audio.volume = 0.36;
  audio.loop = true;
  audio.preload = "auto";
  audio.src = "assets/after-dark.mp3";
  audio.load();
  // Best-effort autoplay. Browsers may block audible autoplay until the user interacts.
  window.addEventListener("load", () => {
    const attempt = audio.play();
    if (attempt && typeof attempt.then === "function") {
      attempt.then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  });

  $("langBtn").addEventListener("click", () => {
    english = !english;
    const c = currentCopy();
    document.documentElement.lang = english ? "en" : "ar";
    document.documentElement.dir = english ? "ltr" : "rtl";
    $("langBtn").innerHTML = english ? 'AR <span>↗</span>' : 'EN <span>↗</span>';
    translationIds.forEach(id => { if ($(id) && c[id] !== undefined) $(id).innerHTML = c[id]; });
    $("heroTitle").innerHTML = c.heroTitle;
    updatePlayerUi();
    updateClock(true);
  });
  $("copyDiscord").addEventListener("click", async () => {
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(".a2x_");
      showToast(currentCopy().copied);
    } catch (_) { showToast(currentCopy().copyFailed); }
  });
  function updateClock(force = false) {
    const now = new Date();
    const stamp = `${now.getHours()}:${now.getMinutes()}:${now.getDate()}:${english}`;
    if (!force && stamp === lastClockStamp) return;
    lastClockStamp = stamp;
    $("clock").textContent = new Intl.DateTimeFormat(english ? "en-GB" : "ar-SA", { hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
    $("year").textContent = String(now.getFullYear());
  }
  setInterval(() => updateClock(), 1000);
  updateClock(true);
  updatePlayerUi();
})();
