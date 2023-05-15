#!/bin/bash
# This is a script from im-in.space.
# This will clone 3rd-party themes for deployement.
# To prevent errors, you should execute this script in CI for code testing

# Function to `git pull` or `git clone` remote repository
pullOrClone () {
  if [ -d "$1" ]; then
    cd "$1"
    git pull
    cd ..
  else
    git clone "$2"
  fi
}

# Create destination dirs (i.e. for Docker build)
mkdir -p app/javascript/styles/modern

# Create our working dir
mkdir -p .themes
cd .themes

# Stop if something goes wrong
set -e

# And now we go get and copy our themes
## - MFC
pullOrClone "mastomods" "https://github.com/trwnh/mastomods.git"
cp -r mastomods/app/javascript/styles/mfc/ ../app/javascript/styles/

## - Cyberpunk-Neon
pullOrClone "Cyberpunk-Neon" "https://github.com/Roboron3042/Cyberpunk-Neon.git"
cp Cyberpunk-Neon/CSS/mastodon-cyberpunk-neon.css ../app/javascript/styles/_cyberpunk-neon.scss

## - mastodon-bird-ui
pullOrClone "mastodon-bird-ui" "https://github.com/ronilaukkarinen/mastodon-bird-ui.git"
cp mastodon-bird-ui/layout-single-column.css ../app/javascript/styles/_mastodon-bird-ui-single.scss
cp mastodon-bird-ui/layout-multiple-columns.css ../app/javascript/styles/_mastodon-bird-ui-multi.scss

## - Modern
pullOrClone "Mastodon-Modern" "https://codeberg.org/Freeplay/Mastodon-Modern.git"
cp Mastodon-Modern/modern.css ../app/javascript/styles/modern/style.scss
