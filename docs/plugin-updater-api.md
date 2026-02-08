# MadeIT Plugin Updater – voorbeeld server response

De theme-updater accepteert 2 response-vormen:

1) Object met `plugins`
2) Een raw array met plugin items

Minimaal vereist per plugin item:
- `plugin` (plugin file, bv. `my-plugin/my-plugin.php`)
- `new_version` (of `version`)
- `package` (of `download_url`) => directe URL naar een ZIP

## Variant A: `{ "plugins": [...] }`

```json
{
  "plugins": [
    {
      "plugin": "forms-by-made-it/forms-by-made-it.php",
      "slug": "forms-by-made-it",
      "name": "Forms (Made I.T.)",
      "new_version": "3.4.2",
      "package": "https://updates.example.com/download/forms-by-made-it/3.4.2/forms-by-made-it.zip",
      "url": "https://madeit.be/plugins/forms",
      "requires": "5.8",
      "tested": "6.5",
      "sections": {
        "description": "Interne formulieren-plugin met custom integraties.",
        "changelog": "- Fix: ...\n- Added: ..."
      }
    },
    {
      "plugin": "safe-svg/safe-svg.php",
      "slug": "safe-svg",
      "name": "Safe SVG (Made I.T. patched)",
      "new_version": "2.3.1-madeit.1",
      "package": "https://updates.example.com/download/safe-svg/2.3.1-madeit.1/safe-svg.zip",
      "homepage": "https://wordpress.org/plugins/safe-svg/",
      "sections": {
        "description": "Officiële plugin met Made I.T. patch(es).",
        "changelog": "- Patch: ..."
      }
    }
  ]
}
```

## Variant B: raw array `[...]`

```json
[
  {
    "plugin": "madeit-custom-plugin/madeit-custom-plugin.php",
    "new_version": "1.2.0",
    "download_url": "https://updates.example.com/download/madeit-custom-plugin/1.2.0/madeit-custom-plugin.zip"
  }
]
```

## Opmerkingen
- `plugin` moet exact overeenkomen met de key die WordPress gebruikt in `update_plugins` (bv. `woocommerce/woocommerce.php`).
- `package` / `download_url` moet publiek bereikbaar zijn voor de updater (of via auth op server-niveau).
- Als je ZIP foldernaam niet exact overeenkomt met de plugin foldernaam, probeert de updater de map te hernoemen tijdens install.
