# Mastodon Glitch Edition

> im-in.space variant

[![Ruby Testing](https://github.com/im-in-space/mastodon/actions/workflows/test-ruby.yml/badge.svg)](https://github.com/im-in-space/mastodon/actions/workflows/test-ruby.yml)

im-in.space is running on the [glitch social's fork of Mastodon](https://github.com/glitch-soc/mastodon), which instroduces new features.

Differences from glitch-soc ([compare source](https://github.com/glitch-soc/mastodon/compare/main...im-in-space:mastodon:im-in.space)):

- Some minor fixes
- Allow access to the Internet Archive bots
- Instance admin can link to the instance URL in his profile and appear verified
- Mentions share the appearance of regular links in posts
- Send a post to Google Translate (to be deprectated)
- Tenor GIF search and embed
- Added our Space skin (based on [Flat, Dark and Colourful!](https://userstyles.org/styles/140852/mastodon-flat-dark-and-colourful) by Dia)
- Added third-party skins, some only for Vanilla, which requires you to run [`cloneThemes.sh`](cloneThemes.sh):
  - [Cyberpunk Neon by Roboron](https://github.com/Roboron3042/Cyberpunk-Neon/tree/master/CSS#css-themes)
  - [Mastodon Bird UI by Roni Laukkarinen (Dark, Light, High contrast)](https://github.com/ronilaukkarinen/mastodon-bird-ui)
  - [Mastodon Flat by trwnh (mostly broken)](https://github.com/trwnh/mastomods)
  - [Modern by freeplay (Dark, Light)](https://codeberg.org/Freeplay/Mastodon-Modern)
  - [Tangerine UI by Niléane (Default, Purple, Cherry)](https://github.com/nileane/TangerineUI-for-Mastodon)
- **HARDCODED CHANGES:**
  - Additional rules blocks added in `.../features/about/index.jsx` ([Glitch](app/javascript/flavours/glitch/features/about/index.jsx)/[Vanilla](app/javascript/mastodon/features/about/index.jsx))
  - Additional warning about not using anonymizer email services in [`.../registrations/new.html.haml`](app/views/auth/registrations/new.html.haml#L39-L44)
  - Logo and colors set to Portal's Space Core, image [by Terton](http://tertonda.deviantart.com/art/Space-Core-268796291)
  - String changes (at least in English):
    - `Federated timeline` => `Galactic timeline`
    - `Home` => `My space`
    - `Local timeline` => `Solar System's timeline`
    - `Publish` => `Launch`

For glitch-soc:

- You can view documentation for this project at [glitch-soc.github.io/docs/](https://glitch-soc.github.io/docs/).
- And contributing guidelines are available [here](CONTRIBUTING.md) and [here](https://glitch-soc.github.io/docs/contributing/).
