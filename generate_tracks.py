#!/usr/bin/env python3

import argparse
import json
import re
import sys
from pathlib import Path

try:
    from mutagen import File as MutagenFile
    HAS_MUTAGEN = True
except ImportError:
    HAS_MUTAGEN = False

AUDIO_EXTENSIONS = {".mp3", ".ogg", ".wav", ".m4a", ".flac"}
DEFAULT_EMOJI = "🎵"


def read_tags(path: Path):
    if not HAS_MUTAGEN:
        return None
    try:
        audio = MutagenFile(path, easy=True)
        if audio is None:
            return None
        title = (audio.get("title") or [None])[0]
        artist = (audio.get("artist") or [None])[0]
        year = (audio.get("date") or audio.get("year") or [None])[0]
        genre = (audio.get("genre") or [None])[0]
        if title or artist:
            return {
                "title": title,
                "artist": artist,
                "year": (year or "")[:4] if year else "",
                "genre": genre or "",
            }
    except Exception:
        pass
    return None


def parse_filename(filename: str):
    name = Path(filename).stem
    name = re.sub(r"^\d+[\s._-]*", "", name)
    match = re.match(r"^\s*(.+?)\s*-\s*(.+?)\s*$", name)
    if match:
        return {"artist": match.group(1).strip(), "title": match.group(2).strip()}
    return {"artist": None, "title": name.strip()}


def build_relative_url(file_path: Path, music_root: Path):
    """Gera a url relativa a partir da pasta ./music (independente de subpasta)."""
    rel = file_path.relative_to(music_root.parent)  # inclui 'music/...'
    return "./" + str(rel).replace("\\", "/")


def main():
    parser = argparse.ArgumentParser(description="Gera/atualiza music/tracks.json a partir de uma pasta de áudios.")
    parser.add_argument("--dir", default="./music", help="Pasta com os áudios a catalogar (padrão: ./music)")
    parser.add_argument("--playlist", default="Minha Playlist", help="Nome da playlist a atribuir a essas faixas")
    parser.add_argument("--output", default="./music/tracks.json", help="Caminho do tracks.json (padrão: ./music/tracks.json)")
    args = parser.parse_args()

    scan_dir = Path(args.dir)
    output_path = Path(args.output)
    music_root = Path("./music")

    if not HAS_MUTAGEN:
        print("Aviso: 'mutagen' não instalado — vou usar só os nomes dos arquivos.")
        print("Para ler título/artista de dentro dos arquivos: pip install mutagen --break-system-packages\n")

    if not scan_dir.exists():
        print(f"Pasta '{scan_dir}' não encontrada.")
        sys.exit(1)

    files = sorted(
        [f for f in scan_dir.iterdir() if f.suffix.lower() in AUDIO_EXTENSIONS],
        key=lambda f: f.name.lower(),
    )
    if not files:
        print(f"Nenhum arquivo de áudio encontrado em '{scan_dir}'.")
        sys.exit(1)

    existing = []
    if output_path.exists():
        try:
            with open(output_path, "r", encoding="utf-8") as f:
                existing = json.load(f)
        except Exception as e:
            print(f"Aviso: não consegui ler '{output_path}' existente ({e}). Vou criar um novo.")
            existing = []

    existing_urls = {t.get("url") for t in existing}
    next_id = (max((t.get("id", 0) for t in existing), default=0)) + 1

    added = 0
    skipped = 0
    for f in files:
        url = build_relative_url(f, music_root)
        if url in existing_urls:
            skipped += 1
            continue 

        tags = read_tags(f)
        if not tags or not tags.get("title"):
            fallback = parse_filename(f.name)
            title = fallback["title"]
            artist = fallback["artist"] or "Desconhecido"
            year, genre = "", ""
        else:
            title = tags["title"] or parse_filename(f.name)["title"]
            artist = tags["artist"] or "Desconhecido"
            year = tags.get("year", "")
            genre = tags.get("genre", "")

        existing.append({
            "id": next_id,
            "title": title,
            "artist": artist,
            "genre": genre,
            "year": year,
            "emoji": DEFAULT_EMOJI,
            "url": url,
            "liked": False,
            "playlist": args.playlist,
        })
        next_id += 1
        added += 1

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as out:
        json.dump(existing, out, ensure_ascii=False, indent=2)

    print(f"Pronto! {added} música(s) nova(s) adicionada(s), {skipped} já existente(s) ignorada(s).")
    print(f"Total agora em '{output_path}': {len(existing)} músicas.")
    print("Confira o arquivo — pode corrigir título/artista à mão se algo saiu errado.")


if __name__ == "__main__":
    main()