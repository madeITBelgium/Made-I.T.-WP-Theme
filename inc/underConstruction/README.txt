# 🏗️ Under Construction Module – WordPress Thema
==============================================

De Under Construction Module in dit WordPress-thema is een ingebouwde functie waarmee je eenvoudig een "Website in onderhoud" of "Binnenkort online" pagina kunt activeren, zonder plugins of extra tools. 
Deze functie is ideaal tijdens de ontwikkelingsfase, herwerkingen of tijdelijke offline momenten van een website.

## 📌 Overzicht
------------

Deze functie stelt je in staat om:
• Een volledig afgeschermde website te tonen voor bezoekers.
• Beheerders toegang te geven tot de volledige site, inclusief front-end.
• De tekst, stijl, achtergrond en zelfs contactinformatie van de "under construction"-pagina zelf aan te passen.
• Volledig controle te behouden zonder tussenkomst van extra plugins of codewijzigingen.

## ⚙️ Functionaliteiten
--------------------

** 1. In- of uitschakelen van de modus **
Via een eenvoudige aan/uit-schakelaar in het dashboard activeer of deactiveer je de 'under construction' mode.
Wanneer ingeschakeld, wordt elke pagina van de website vervangen door de custom “Under Construction”-pagina, tenzij de gebruiker is ingelogd als beheerder of ander toegewezen rol.

** 2. Controleer wie de website wel mag zien **
Je kan de website toegankelijk maken voor wie jij wilt. Dit kan bijvoorbeeld voor specifieke rollen zoals beheerders, redacteuren of andere gebruikers met bepaalde rechten.
Hierdoor kunnen ontwikkelaars en designers de website blijven bekijken en aanpassen zonder dat bezoekers de pagina zien.

** 3. automatisch deactiveren na een bepaalde tijd **
Je kunt een datum en tijd instellen waarop de 'under construction' modus automatisch wordt uitgeschakeld. 
Dit is handig voor geplande lanceringen of onderhoudsvensters, zodat je niet handmatig hoeft in te grijpen.

## 🛠️ Aan de slag
-----------------

** 1. Kies jouw template **
De module biedt standaard enkele templates voor de "Under Construction" pagina.
Je kunt kiezen uit verschillende stijlen, zoals een eenvoudige tekstpagina of een meer visueel aantrekkelijke pagina met afbeeldingen en logo's.

Bij elk template kan je dan - naar gelang welk template je kiest - enkele instellingen aanpassen.


** 2. Inhoud aanpassen **
Pas de inhoud van de pagina aan naargelang jouw wensen.
Je kunt de titel, subtitel en beschrijving wijzigen om een boodschap te tonen die past bij jouw situatie.
Gebruik hiervoor de beschikbare velden in de inhout instellingen van de module.

Je kunt bijvoorbeeld een korte boodschap tonen zoals:
```plaintext
Titel: “Website in onderhoud”
Subtitel: “We werken hard aan iets moois”
Beschrijving: “Kom snel terug om het resultaat te bewonderen.”
```


## Waar te vinden
-----------------
De instellingen voor de Under Construction Module zijn te vinden in het WordPress-dashboard onder:
> Dashboard > Instellingen > Under Construction

## 📄 instellingen

### Instellingen Overzicht
De instellingenpagina biedt een overzicht van alle beschikbare opties om de "Under Construction" pagina aan te passen. 
Hier kun je de modus activeren, de inhoud wijzigen en de stijl van de pagina bepalen.


Beschikbare velden:

| Instelling                     | Type                  | Beschrijving                                                          |
| ------------------------------ | --------------------- | --------------------------------------------------------------------- |
| **Under Construction aan/uit** | Schakelaar (checkbox) | Activeert of deactiveert de maintenance-modus.                        |
| **Titel**                      | Tekstveld             | Hoofdtitel op de Under Construction pagina (bijv. “We zijn bezig!”).  |
| **Subtitel**                   | Tekstveld             | Korte extra boodschap onder de titel.                                 |
| **Beschrijving**               | Tekstgebied           | Uitgebreide uitleg of mededeling voor bezoekers.                      |
| **Achtergrondtype**            | Keuzelijst            | Kies tussen een egale kleur of een achtergrondafbeelding.             |
| **Achtergrondafbeelding**      | Afbeelding upload     | Upload een achtergrond (indien gekozen in vorige optie).              |
| **Achtergrondkleur**           | Kleurkiezer           | Kies een achtergrondkleur (indien geen afbeelding gebruikt wordt).    |
| **Logo**                       | Afbeelding upload     | Optioneel eigen logo bovenaan de pagina.                              |
| **Countdown inschakelen**      | Schakelaar            | Activeer een countdown timer naar een specifieke datum.               |
| **Lanceringsdatum**            | Datumkiezer           | Datum & tijd waarop de site live gaat (alleen bij actieve countdown). |
| **Contactlink**                | URL / e-mail          | Voeg een link toe naar een contactformulier of e-mailadres.           |
| **Custom CSS**                 | Tekstgebied           | Voeg handmatig CSS toe voor extra opmaak of branding.                 |


> [!WARNING]
> ** ⚠️ Belangrijk **
> Cache-plugins kunnen de pagina blijvend tonen, zelfs nadat de functie is uitgeschakeld. Vergeet niet je cache te legen.
> Zorg dat je zelf nog toegang hebt als beheerder, zeker als je werkt met loginrestricties.


## Changelog
v1.0.0
- Basisfunctionaliteit (titel, achtergrond, logo)
- Toegang voor beheerders en specifieke rollen
- Automatische deactivatie na een bepaalde datum
- Links naar social media en contactinformatie

v1.1.0 (binnenkort)

- Meerdere templates
- Countdown functie
