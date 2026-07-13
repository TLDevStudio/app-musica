// ── Isolamento por site ──
// O localStorage é compartilhado por domínio, não por repositório.
// Se este app estiver hospedado em algo como "usuario.github.io/algum-repo/",
// usamos o caminho (pathname) como parte da chave, para que cada projeto
// tenha sua própria "gaveta" de dados mesmo estando no mesmo domínio.
const STORAGE_PREFIX = 'mysound_' + location.pathname.replace(/[^a-zA-Z0-9]/g, '_') + '_';

const DATA_VERSION = 'v5';
if (localStorage.getItem(STORAGE_PREFIX + 'data_version') !== DATA_VERSION) {
    localStorage.removeItem(STORAGE_PREFIX + 'tracks');
    localStorage.setItem(STORAGE_PREFIX + 'data_version', DATA_VERSION);
}

let tracks = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'tracks') || '[]');
let currentIdx = -1;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let isMuted = false;
let volume = 0.8;
let selectedEmoji = '🎵';

const audio = document.getElementById('audioEl');
audio.volume = volume;

if (tracks.length === 0) {
    tracks = [
        { id: 1, title: 'O Homem das Mãos Furadas', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/o-homem-das-maos-furadas.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 2, title: 'Corinhos Pentecostais', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/corinhos-pentecostais.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 3, title: 'Companheiro', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/companheiro.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 4, title: 'Voz do Coração', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/voz-do-coracao.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 5, title: 'Pára Zé', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/para-ze.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 6, title: 'Vida Vazia', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/vida-vazia.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 7, title: 'Água Cristalina', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/agua-cristalina.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 8, title: 'Fogo Santo', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/fogo-santo.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 9, title: 'O Fogo Vai Queimar', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/o-fogo-vai-queimar.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 10, title: 'Guardado 24 Horas', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/guardado-24h.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 11, title: 'Tem Crente Por Todo Lado', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/tem-crente-por-todo-lado.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 12, title: 'Gemido da Alma', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/gemido-da-alma.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 13, title: 'A História das Assembleias de Deus', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/a-historia.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 14, title: 'Tem Poder de Deus', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/tem-poder-de-Deus.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 15, title: 'Grande Amor', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/grande-amor.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 16, title: 'Essa Luta Vai Passar', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/essa-luta-vai-passar.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 17, title: 'Horário Marcado', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/horario-marcado.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 18, title: 'De Bota, Chapéu e Cinturão', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/de-bota.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 19, title: 'Murmurador', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/murmurador.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 20, title: 'Ele Veio', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/ele-veio.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 21, title: 'Irmã de Oração', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/irma-de-oracao.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 22, title: 'Jesus Está Aqui', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/Jesus-esta-aqui.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 23, title: 'Divino Companheiro', artist: 'Mara Lima', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/divino-companheiro.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 24, title: 'Deuteronômio 28', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/deuteronomio-28.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 25, title: 'Irmão Joaquim', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/irmao-joaquim.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 26, title: 'Comece a Pensar no Céu', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/comece-a-pensar-no-ceu.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 27, title: 'Guarânia', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/guarania.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 28, title: 'O Homem Sem Deus', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/o-homem-sem-Deus.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 29, title: 'Quem Diria', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/quem-diria.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 30, title: 'Dia de Sol', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/dia-de-sol.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 31, title: 'Viúva Sem Nada', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/viuva-sem-nada.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 32, title: 'Dia do Milagre', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/dia-do-milagre.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 33, title: 'Quer Vitória', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/quer-vitoria.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 34, title: 'Alma Cansada', artist: 'Jair Pires', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/alma-cansada.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 35, title: 'Livre pra Voar', artist: 'Jair Pires', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/livre-pra-voar.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 36, title: 'No Céu Não Entra Pecado', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/no-ceu-nao-entra-pecado.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 37, title: 'Se Isso Não For Amor', artist: 'Suellen Lima e Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/se-isso-nao-for-amor.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 38, title: 'Pregadores de Rosas', artist: 'Marcos Antonio', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/pregadores-de-rosa.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 39, title: 'Me Entreguei', artist: 'Os Levitas Flavio e Kaique', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/me-entreguei.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 40, title: 'Uma Saída', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/uma-saida.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 41, title: 'Deus Acima de Todos', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/Deus-acima-de-todos.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 42, title: 'Tem Que Ser Pequeno', artist: 'Dinamite Barros', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/tem-que-ser-pequeno.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 43, title: 'Com Ele', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/com-ele.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 44, title: 'Voz do Coração', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/voz-do-coracao2.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 45, title: 'A Minha Família', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/a-minha-familia.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 46, title: 'O Pastorzinho', artist: 'Daniel e Samuel', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/o-pastorzinho.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 47, title: 'Minha Licença', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/minha-licenca.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 48, title: 'Essa Luta Vai Passar', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/essa-luta-vai-passar2.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 49, title: 'Sapateando na Brasa', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/sapateando-na-brasa.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 50, title: 'Poder do Alto', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/poder-do-alto.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 51, title: 'Primeiro Olhar', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/primeiro-olhar.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 52, title: 'Deixa Esta Vida Triste', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/deixa-esta-vida-triste.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 53, title: 'Longe do Seu Olhar', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/longe-do-seu-olhar.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 54, title: 'O Segredo da Conquista', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/o-segredo-da-conquista.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 55, title: 'O Caroneiro', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/o-caroneiro.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 56, title: 'Fogo Estranho', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/fogo-estranho.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 57, title: 'Soldado Machucado', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/soldado-machucado.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 58, title: 'Além da Emoção', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/alem-da-emocao.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 59, title: 'Toca Nele', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/toca-nele.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 60, title: 'Maravilhoso', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/maravilhoso.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 61, title: 'Nova Unção', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/nova-uncao.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 62, title: 'Deus Que Não Falha', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/Deus-que-nao-falha.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 63, title: 'Cheiro de Vitória', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/cheiro-de-vitoria.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 64, title: 'Nosso Chão', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/nosso-chao.mp3', liked: false, playlist: 'Os Levitas' },
        { id: 65, title: 'Romântico D+', artist: 'Os Levitas', genre: 'Gospel', year: '1997', emoji: '🙏', url: './music/romantico-d+.mp3', liked: false, playlist: 'Os Levitas' },
    ];
    saveTracks();
}

function saveTracks() {
    localStorage.setItem(STORAGE_PREFIX + 'tracks', JSON.stringify(tracks));
}

function render(list) {
    const tl = document.getElementById('trackList');
    const sp = document.getElementById('sidebarPlaylist');
    const countEl = document.getElementById('trackCount');
    const visEl = document.getElementById('visibleCount');

    countEl.textContent = `${tracks.length} faixa${tracks.length !== 1 ? 's' : ''} na sua biblioteca`;
    visEl.textContent = list.length !== tracks.length ? `${list.length} resultados` : '';

    tl.innerHTML = list.map((t) => `
    <div class="track-item ${currentIdx !== -1 && tracks[currentIdx]?.id === t.id ? 'active' : ''}" onclick="playTrack(${tracks.indexOf(t)})">
      <div class="track-num">
        ${currentIdx !== -1 && tracks[currentIdx]?.id === t.id
            ? `<div class="eq ${isPlaying ? '' : 'paused'}"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>`
            : tracks.indexOf(t) + 1}
      </div>
      <div class="track-cover">${t.emoji}</div>
      <div class="track-meta">
        <div class="track-name">${t.title}</div>
        <div class="track-artist-name">${t.artist}</div>
      </div>
      <div class="track-duration">${t.duration || '—'}</div>
      <button class="track-like ${t.liked ? 'liked' : ''}" onclick="event.stopPropagation(); toggleLike(${tracks.indexOf(t)})">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="${t.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
    </div>
  `).join('');

    sp.innerHTML = tracks.map((t, i) => `
    <div class="sidebar-track ${currentIdx === i ? 'active' : ''}" onclick="playTrack(${i})">
      <div class="sidebar-track-num">${currentIdx === i ? '▶' : i + 1}</div>
      <div class="sidebar-thumb">${t.emoji}</div>
      <div class="sidebar-track-info">
        <div class="sidebar-track-title">${t.title}</div>
        <div class="sidebar-track-artist">${t.artist}</div>
      </div>
    </div>
  `).join('');
}

function filterTracks() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const filtered = q ? tracks.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        (t.genre || '').toLowerCase().includes(q)
    ) : tracks;
    render(filtered);
}

function playTrack(idx) {
    if (idx < 0 || idx >= tracks.length) return;
    currentIdx = idx;
    const t = tracks[idx];

    document.getElementById('heroCover').textContent = t.emoji;
    document.getElementById('heroTitle').textContent = t.title;
    document.getElementById('heroArtist').textContent = t.artist;
    document.getElementById('heroGenre').textContent = t.genre || '—';
    document.getElementById('heroYear').textContent = t.year || '—';

    document.getElementById('playerThumb').textContent = t.emoji;
    document.getElementById('playerName').textContent = t.title;
    document.getElementById('playerArtist').textContent = t.artist;
    updateHeartBtn();

    if (t.url) {
        audio.src = t.url;
        audio.play().then(() => { isPlaying = true; updatePlayBtn(); }).catch(() => { simulatePlay(); });
    } else {
        simulatePlay();
    }
    render(tracks);
}

function simulatePlay() {
    isPlaying = true;
    updatePlayBtn();
    document.getElementById('totalTime').textContent = '3:30';
    clearInterval(window._simTimer);
    let sec = 0;
    const total = 210;
    window._simTimer = setInterval(() => {
        if (!isPlaying) return;
        sec++;
        if (sec >= total) { sec = 0; nextTrack(); return; }
        document.getElementById('currentTime').textContent = fmt(sec);
        document.getElementById('progressFill').style.width = (sec / total * 100) + '%';
    }, 1000);
}

function togglePlay() {
    if (currentIdx === -1) { if (tracks.length) playTrack(0); return; }
    if (audio.src && audio.src !== window.location.href) {
        isPlaying ? audio.pause() : audio.play();
        isPlaying = !isPlaying;
    } else {
        isPlaying = !isPlaying;
    }
    updatePlayBtn();
    render(tracks);
}

function updatePlayBtn() {
    const icon = document.getElementById('playIcon');
    if (isPlaying) {
        icon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    } else {
        icon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
    }
    document.getElementById('eqBars').classList.toggle('paused', !isPlaying);
}

function nextTrack() {
    if (!tracks.length) return;
    let next;
    if (isShuffle) {
        next = Math.floor(Math.random() * tracks.length);
    } else {
        next = (currentIdx + 1) % tracks.length;
    }
    playTrack(next);
}

function prevTrack() {
    if (!tracks.length) return;
    const prev = (currentIdx - 1 + tracks.length) % tracks.length;
    playTrack(prev);
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    document.getElementById('shuffleBtn').classList.toggle('active', isShuffle);
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    audio.loop = isRepeat;
    document.getElementById('repeatBtn').classList.toggle('active', isRepeat);
}

audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('currentTime').textContent = fmt(audio.currentTime);
    document.getElementById('totalTime').textContent = fmt(audio.duration);
});

audio.addEventListener('ended', () => {
    if (!isRepeat) nextTrack();
});

audio.addEventListener('play', () => { isPlaying = true; updatePlayBtn(); render(tracks); });
audio.addEventListener('pause', () => { isPlaying = false; updatePlayBtn(); render(tracks); });

// ── Barra de progresso: suporte a mouse E toque ──
function getProgressPct(bar, clientX) {
    const rect = bar.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
}

function applySeek(pct) {
    if (audio.duration) {
        audio.currentTime = pct * audio.duration;
    } else {
        const total = 210;
        const sec = Math.floor(pct * total);
        document.getElementById('currentTime').textContent = fmt(sec);
        document.getElementById('progressFill').style.width = (pct * 100) + '%';
    }
}

const progressBar = document.getElementById('progressBar');

// Mouse
progressBar.addEventListener('click', (e) => {
    applySeek(getProgressPct(progressBar, e.clientX));
});

let isSeeking = false;
progressBar.addEventListener('touchstart', (e) => {
    isSeeking = true;
    e.preventDefault();
    applySeek(getProgressPct(progressBar, e.touches[0].clientX));
}, { passive: false });

progressBar.addEventListener('touchmove', (e) => {
    if (!isSeeking) return;
    e.preventDefault();
    applySeek(getProgressPct(progressBar, e.touches[0].clientX));
}, { passive: false });

progressBar.addEventListener('touchend', () => { isSeeking = false; });

function setVolume(e) {
    const bar = document.getElementById('volSlider');
    volume = Math.max(0, Math.min(1, e.offsetX / bar.offsetWidth));
    audio.volume = volume;
    document.getElementById('volFill').style.width = (volume * 100) + '%';
    isMuted = volume === 0;
    updateVolIcon();
}

function toggleMute() {
    isMuted = !isMuted;
    audio.muted = isMuted;
    updateVolIcon();
}

function updateVolIcon() {
    const icon = document.getElementById('volIcon');
    if (isMuted || volume === 0) {
        icon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2"/><line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2"/>`;
    } else {
        icon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>`;
    }
}

function toggleLike(idx) {
    tracks[idx].liked = !tracks[idx].liked;
    saveTracks();
    updateHeartBtn();
    filterTracks();
}

function toggleLikeCurrent() {
    if (currentIdx === -1) return;
    toggleLike(currentIdx);
}

function updateHeartBtn() {
    const btn = document.getElementById('playerHeart');
    const t = tracks[currentIdx];
    if (!t) return;
    btn.classList.toggle('liked', t.liked);
    btn.querySelector('svg').setAttribute('fill', t.liked ? 'currentColor' : 'none');
}

function openModal() {
    document.getElementById('modalOverlay').classList.add('open');
}
function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
}
function closeModalOutside(e) {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
}

function selectEmoji(el, emoji) {
    document.querySelectorAll('.emoji-opt').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
    selectedEmoji = emoji;
}

function addTrack() {
    const title = document.getElementById('inputTitle').value.trim();
    const artist = document.getElementById('inputArtist').value.trim();
    if (!title) { document.getElementById('inputTitle').focus(); return; }
    const t = {
        id: Date.now(),
        title,
        artist: artist || 'Desconhecido',
        genre: document.getElementById('inputGenre').value.trim(),
        year: document.getElementById('inputYear').value.trim(),
        url: document.getElementById('inputUrl').value.trim(),
        emoji: selectedEmoji,
        liked: false
    };
    tracks.push(t);
    saveTracks();
    closeModal();
    ['inputTitle', 'inputArtist', 'inputGenre', 'inputYear', 'inputUrl'].forEach(id => document.getElementById(id).value = '');
    render(tracks);
}

function setNav(el) {
    document.querySelectorAll('.nav-item').forEach(e => e.classList.remove('active'));
    el.classList.add('active');
}

function fmt(s) {
    const sec = Math.floor(s);
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('./sw.js')
            .then((reg) => console.log('[SW] Registrado:', reg.scope))
            .catch((err) => console.warn('[SW] Falhou:', err));
    });
}

function renderPlaylists() {

    const names = [...new Set(tracks.filter(t => t.playlist).map(t => t.playlist))];
    if (!names.length) return;

    let container = document.getElementById('playlistSection');
    if (!container) {
        container = document.createElement('div');
        container.id = 'playlistSection';
        document.querySelector('.section-header').insertAdjacentElement('beforebegin', container);
    }

    container.innerHTML = `
        <div class="section-header" style="margin-bottom:16px;">
            <div class="section-title">Playlists</div>
        </div>
        ${names.map(name => {
        const songs = tracks.filter(t => t.playlist === name);
        return `
            <div class="playlist-box" id="box-${name.replace(/\s/g, '-')}" onclick="togglePlaylist(this)">
                <div class="playlist-box-header">
                    <div class="playlist-box-info">
                        <span class="playlist-box-emoji">🎵</span>
                        <div>
                            <div class="playlist-box-name">${name}</div>
                            <div class="playlist-box-count">${songs.length} músicas</div>
                        </div>
                    </div>
                    <span class="playlist-chevron">▾</span>
                </div>
                <div class="playlist-tracks" style="display:none;">
                    ${songs.map((t) => `
                    <div class="track-item ${currentIdx !== -1 && tracks[currentIdx]?.id === t.id ? 'active' : ''}"
                         onclick="event.stopPropagation(); playTrack(${tracks.indexOf(t)})">
                        <div class="track-num">${tracks.indexOf(t) + 1}</div>
                        <div class="track-cover">${t.emoji}</div>
                        <div class="track-meta">
                            <div class="track-name">${t.title}</div>
                            <div class="track-artist-name">${t.artist}</div>
                        </div>
                        <div class="track-duration">${t.duration || '—'}</div>
                        <button class="track-like ${t.liked ? 'liked' : ''}"
                            onclick="event.stopPropagation(); toggleLike(${tracks.indexOf(t)})">
                            <svg width="14" height="14" viewBox="0 0 24 24"
                                fill="${t.liked ? 'currentColor' : 'none'}"
                                stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </button>
                    </div>`).join('')}
                </div>
            </div>`;
    }).join('')}
    `;
}

function togglePlaylist(box) {
    const tracks_div = box.querySelector('.playlist-tracks');
    const chevron = box.querySelector('.playlist-chevron');
    const open = tracks_div.style.display === 'block';
    tracks_div.style.display = open ? 'none' : 'block';
    chevron.style.transform = open ? '' : 'rotate(180deg)';
}

const playlistStyle = document.createElement('style');
playlistStyle.textContent = `
.playlist-box {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 14px;
    margin-bottom: 10px;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.2s;
}
.playlist-box:hover { border-color: var(--accent); }
.playlist-box-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
}
.playlist-box-info { display: flex; align-items: center; gap: 14px; }
.playlist-box-emoji {
    width: 48px; height: 48px; border-radius: 10px;
    background: var(--surface); display: flex; align-items: center;
    justify-content: center; font-size: 1.5rem;
}
.playlist-box-name { font-size: 0.95rem; font-weight: 500; }
.playlist-box-count { font-size: 0.75rem; color: var(--muted); margin-top: 2px; }
.playlist-chevron {
    color: var(--muted); font-size: 1.1rem;
    transition: transform 0.25s;
}
.playlist-tracks { padding: 0 8px 8px; }
`;
document.head.appendChild(playlistStyle);

render(tracks);
renderPlaylists();