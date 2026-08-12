#!/usr/bin/env bash
set -euo pipefail

video="assets/media/portfolio-universe-720p.mp4"
poster="assets/media/portfolio-universe-poster.webp"
pawrelay="assets/images/pawrelay-product.webp"
research="assets/images/f301-evidence.webp"

test -s "$video"
test -s "$poster"
test -s "$pawrelay"
test -s "$research"

width=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$video")
height=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$video")
duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$video")
audio_count=$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$video" | wc -l | tr -d ' ')
size=$(stat -f %z "$video")

test "$width" = "1280"
test "$height" = "720"
awk -v value="$duration" 'BEGIN { exit !(value >= 15 && value < 15.2) }'
test "$audio_count" = "0"
test "$size" -ge 6000000
test "$size" -le 11000000
