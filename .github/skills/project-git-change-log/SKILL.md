---
name: project-git-change-log
description: "Gebruik deze skill om de huidige projectversie met de vorige Git-versie te vergelijken, alle wijzigingen op te sommen, een gedetailleerde changelog te maken en een samenvatting in readme.txt te plaatsen."
---

# Project Git Change Log Skill

## Doel
Deze skill vergelijkt de huidige projectstatus met de vorige Git-versie en levert:
- een complete lijst van gewijzigde bestanden en wijzigingstypen
- een gedetailleerde changelog van inhoudelijke wijzigingen
- een korte samenvatting toegevoegd aan `readme.txt`

## Wanneer gebruiken
Gebruik deze skill wanneer je:
- het project wilt beoordelen na de laatste commit
- een changelog wilt genereren voor release-notities
- een overzicht wilt toevoegen aan de README/`README.txt`

## Workflow
1. Open het project in wp-content/themes/madeit
2. Controleer of de repository een geldige Git-geschiedenis heeft.
3. Bepaal de vorige versie uit Git, bij voorkeur via de meest recente tag of release:
   - `git describe --tags --abbrev=0 HEAD^` of
   - `git rev-list --tags --max-count=1`
4. Vergelijk de huidige HEAD met die vorige Git-versie:
   - `git diff --name-status <previous-version> HEAD`
5. Lijst alle gewijzigde, toegevoegde, verwijderde en hernoemde bestanden.
6. Beschrijf de inhoudelijke wijzigingen per bestand:
   - functionele verbeteringen
   - bugfixes
   - nieuwe of verwijderde features
   - configuratie- of dependency-aanpassingen
7. Genereer een gedetailleerde changelog met secties zoals:
   - Added
   - Changed
   - Fixed
   - Removed
8. Werk `README.txt` bij met een korte en duidelijke samenvatting van de belangrijkste wijzigingen.

## Output
- `README.txt` bijgewerkt met een overzicht van de belangrijkste wijzigingsthema's.
- Een nieuwe of bijgewerkte changelog in de projectroot.
- Een duidelijke opsomming van alle Git-wijzigingen in de opdrachtreactie.

## Opmerkingen
- Als de huidige HEAD nog niet gecommit is, gebruik dan de meest recente commit en beschrijf ook de niet-geverifieerde wijzigingen.
- Als er meerdere commits sinds de vorige tag of release zijn, geef een kort overzicht van alle commits en gebruik de meest relevante regelelementen voor release-notities.

## Voorbeeldtrigger
- "Vergelijk huidige projectversie met vorige Git-versie en maak een changelog"
- "Maak een gedetailleerde release-notes changelog en update README.txt"