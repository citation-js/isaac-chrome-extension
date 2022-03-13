#!/usr/bin/env bash

for size in $(echo -e "16\n32\n48\n64\n128"); do convert -density 1200 -resize "${size}x${size}" icon.svg "icon-${size}.png"; done
