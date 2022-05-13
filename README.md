# Paketointi

[Power Platform ratkaisupaketin](https://docs.microsoft.com/en-us/power-platform/alm/solution-concepts-alm) saa muodostettua [Microsoft Power Platform CLI](https://docs.microsoft.com/en-us/power-apps/developer/data-platform/powerapps-cli) -työkalulla:

`pac solution pack --zipfile PataD365_managed.zip --folder PataD365 --errorlevel Verbose --packagetype managed`

# Asennusohjeet

## Luodaan Power Platform-ympäristöt

Luo [Power Platform ympäristö](https://docs.microsoft.com/en-us/power-platform/admin/create-environment):
- Create a database
- Default language: English
- Enable Dynamics 365 apps: Customer Service (Enterprise)

## Asennetaan Omnichannel for Customer Service

Asennusohje ja esivaatimukset löytyvät dokumentaatiosta
<https://docs.microsoft.com/en-us/dynamics365/customer-service/omnichannel-provision-license>.

Omnichannel asennuksen yhteydessä enabloidaan kanavat: **Chat, Microsoft Teams.**

Huom! Asennus vaatii mm. O365 tenantin Global Administrator roolin.
## Päivitä Power Platform-ympäristöjen perusasetukset

- Modern Settings-\>Features-\>**Relevance search**: enable relevance search (relevance search entity and field configuration part of PataD365 solution package)
- Modern Settings-\>Features-\>Power Apps component framework for canvas apps-\>**Allow publishing of canvas apps with code components**: enabled (mahdollistaa CanvasFileDownloaderControl PCF)
- Modern Settings-\>Product-\>**Language**: enable languages Finnish & Swedish (Takes around 1h to complete)
- Modern Settings-\>Audit and logs-\>**Audit settings**: start auditing, log access, read logs all enabled
- Classic Settings-\>Administration-\>System Settings-\>**Formats**: set current format to Finnish (Finland)

## Asennna tarvittavat Dynamics 365-sovellukset

PataD365-ratkaisupaketti sisältää riippuvuuksia seuraaviin Dynamics 365 applikaatioihin. Asenna:
- Dynamics 365 Productivity Tools (Asennuksen kesto 1min)
- Dynamics 365 Service Scheduling (Asennuksen kesto noin 30min)

Lisäksi Omnichannelin PVA chatbot-integraatio vaatii [Omnichannel Power Virtual Agent Extension](https://docs.microsoft.com/en-us/power-virtual-agents/configuration-hand-off-omnichannel#install-extension-solutions) -asennuspaketin joten asennetaan myös se.

**Huom! Käyttöliittymästä löytyy kaksi pakettia samalla nimellä, varmista että asennetaan oheinen ilman voice-tukea**:
- Omnichannel Power Virtual Agent Extension (Asennuksen kesto noin 5 minuuttia)

Kaikki nämä tulee asentaa ennen Pata-ratkaisupaketteja Power Platformin Admin Centerin ympäristökohtaisten Dynamics 365 applikaatioiden valikon kautta: <https://admin.powerplatform.microsoft.com/environments>

## Asenna räätälöinnit Power Platform-ratkaisupakettien avulla

Asenna seuraavassa järjestyksessä:
- [TimePickerPCF](https://github.com/drivardxrm/TimePicker.PCF): Käytetty Service Time entiteetissä. Mahdollistetaan pelkän kellonajan anto. Tällä hetkellä ei käytetä kellonaikoja: sanallisesti kuvattu aukioloajat.
- [CanvasFileDownloaderControl](https://github.com/rwilson504/PCFControls/tree/master/CanvasFileDownloader): Käytetty Patalogissa (Canvas App) mahdollistamaan liitetiedostojen (Muistiinpanot/annotation) latauksen käyttäjän koneelle.
- **PataD365**: Pata Dynamics 365 Customer Service Omnichannel & Patalogi (Canvas App) ratkaisu.

PataD365 importin yhteydessä tulee asettaa **EnvironmentName** muuttujan arvo tarvittaessa ympäristöä vastaavaksi. Tämä on DEV/TEST/UAT/PROD.

Lisäksi importin yhteydessä (ennen importia) tulee luoda Dataversen connection reference ratkaisupaketin sisältämille Power Automate-pohjaisille työnkuluille. Tämä connection tulee luoda ympäristökohtaisella admin-tunnuksella.

PataD365-sovelluspaketin asennuksen jälkeen ovat jotkut Power automatet Off-tilassa. **Nämä täytyy kääntää On-asentoon aina asennuspaketin päivityksen jälkeen.**

## Konfiguroi ympäristöjen oletusteemat

Teeman voi konfiguroida Web API rajapinnan kautta:
- Teeman [luonti](https://docs.microsoft.com/en-us/powerapps/developer/data-platform/reference/entities/theme)
- Teeman [julkaisu](https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/publishtheme?view=dynamics-ce-odata-9) oletusteemaksi.

Teeman määrittely:
```json
{
    "defaultentitycolor": "#1C304A",
    "defaultcustomentitycolor": "#1F53CD",
    "logotooltip": "PATA",
    "controlshade": "#FFFFFF",
    "selectedlinkeffect": "#EBF3FF",
    "backgroundcolor": "#FFFFFF",
    "globallinkcolor": "#1F53CD",
    "processcontrolcolor": "#1C304A",
    "name": "Pata",
    "headercolor": "#1C304A",
    "isdefaulttheme": false,
    "hoverlinkeffect": "#F5F9FF",
    "navbarshelfcolor": "#FFFFFF",
    "panelheaderbackgroundcolor": "#F8F8F8",
    "accentcolor": "#CC3333",
    "type": true,
    "pageheaderbackgroundcolor": "#FFFFFF",
    "maincolor": "#1F53CD",
    "controlborder": "#1F53CD",
    "navbarbackgroundcolor": "#1C304A",
    "logoimage@odata.bind": "/webresourceset(6fca87cd-a8cd-eb11-bacc-0022487f351a)"
}
```

Teemat ovat riippuvaisia PataD365 solutionissa olevasta [logosta](./PataD365/WebResources/new_patav2_uusi), joten teema tulee konfiguroida solution asennuksen jälkeen.



## Konfiguroi Dynamicsin Business Unitit

Päivitä organisaation nimi (juuri liiketoimintayksikkö) Web API:n kautta arvoksi "Pata". ([You cannot change the organization name using the Business Unit form but it can be changed using the Web API](https://docs.microsoft.com/en-us/power-platform/admin/create-edit-business-units)). Käytä edelliseen operaatioon Postmania oheisin asetuksin.

## Käyttöoikeudet

AzureAD:hen on oltava luotuna AzureAD security groupit joiden avulla käyttäjät linkitetään Dynamics tiimeihin sekä ympäristökohtaiseen AzureAD-ryhmään jonka kautta ympäristöihin mahdollistetaan. Varsinaiset security roolit ja niiden kuvaukset:

| Oikeusrooli | Kuvaus |
| ----------- | ------ |
| Pata Basic User | Mahdollistaa Power Platformin ja Dynamicsin 365 tuotteiden tarjoamia perustoimintoja kuten käyttäjän omien asetusten hallinnan|
| Pata Customer Service Agent | Mahdollistaa Omnichannelin käytön ja asiakaspalveluroolin |
| Pata Owner Organisation Team | Käyttöoikeus Owning Organisation-tauluun ja tätä kautta oman organisaation datariveihin (Owner vs. Owning Organisation). Pata default-tiimi luvittuu organisaatiohierarkian mukaisesti |
| Pata Patalogi Reader | Lukuoikeudet Patalogiin liittyvään dataan ja Patalogi-applikaatioon |
| Pata Patalogi Writer | Kirjoitusoikeudet Patalogiin liittyvään dataan ja PatalogiPro-sovellukseen |
| Pata Terveydenhuollon ammattilainen | Poistuva liikaa käyttöoikeuksia sisältävä security rooli jota käytettiin projektin alussa ennen hienojakoisempia käyttöoikeusmäärityksiä |

Omistavien organisaatioiden liiketoimintayksiköiden oletustiimeille tulee antaa **Pata Owning Organization Team** rooli. Tämä mahdollistaa näiden tiimien omistavan kaiken omistavan organisaation alaisen sisällön (jonka owneriksi asetetaan nämä oletustiimit).

## Yksittäisten Power Appsien jakaminen käyttäjille

**Patalogi (Canvas App)**

Jaetaan AzureAD-ryhmille joihin liitettynä "Pata Patalogi Reader" - security role. Koska AzureAD-ryhmät ja vastaavat Dynamics-tiimit eivät kuulu root BU:hun ei Canvas Appsin Data Permissions valintaa tarvitse välttämättä tehdä.

**Patalogi Pro (Model Driven App)**

Jaetaan AzureAD-ryhmille joihin liitettynä "Pata Patalogi Writer" - security role. Koska kyseessä on Model Driven App riittää että itse applikaatiolle määritellään "Pata Patalogi Writer" - security role. Tämän jälkeen roolia käyttävät Dynamics-tiimit määrittyvät automaattisesti.

**Omnichannel for Customer Service (Model Driven App)**

Jaetaan Dynamics-tiimeille joihin liitettynä "Omnichannel Agent"- security role. Koska kyseessä on Model Driven App riittää että itse applikaatiolle määritellään "Omnichannel Agent"- security role. Tämän jälkeen roolia käyttävät tiimit määrittyvät automaattisesti.

## Omnichannel ja Power Virtual Agent chatbot peruskonfiguraatiot

Omnichannel-konfiguraatiot tehdään ympäristökohtaisesti uudemman "Omnichannel admin centerin" kautta.

Tätä kautta konfiguroidaan mm. Work streamit, jonot, säännöt, chat widgetin asetukset yms. Perusasetukset voidaan myös tuoda paikalleen [Configuration Migration Utilityllä](https://docs.microsoft.com/en-us/dynamics365/customer-service/export-import-omnichannel-data).

Ainakin seuraavat konfiguraatiot täytyy kuitenkin tehdä manuaalisesti:
- Jonojen aukiolot - operating hours (Kalentereja ei voi migroida)
- Jonojen käyttäjät ja luvitukset (Tässä tapauksessa eri AzureAD)
- PVA ChatBot (AzureAD App / Service Principal-riippuvuus)
- Quick Replies (Jätettiin pois koska export / import todella hidas)

## Power Virtual Agent pohjaisen chatbotin liittäminen Omnichanneliin

Omnichannel "[Power Virtual Agent Extension](https://docs.microsoft.com/en-us/power-virtual-agents/configuration-hand-off-omnichannel#install-extension-solutions)" tulee asentaa tai sen asennuksen ajantaisuus varmistaa ensin Power Platformin Admin Centerin ympäristökohtaisten Dynamics 365 applikaatioiden valikon kautta: <https://admin.powerplatform.microsoft.com/environments> . Komponentti pyydettiin asentamaan aiemmin tässä ohjeistuksessa.

Myös muut esivaatimukset tulee täyttyä: <https://docs.microsoft.com/en-us/power-virtual-agents/configuration-hand-off-omnichannel#prerequisites>

Itse PVA chatbot liitetään Omnichanneliin oheisen ohjeen mukaisesti: <https://docs.microsoft.com/en-us/power-virtual-agents/configuration-hand-off-omnichannel>

Omnichannel käsittelee PVA chatbotteja Service Principal-pohjaisesti joten ennen PVA botin lisäämistä tulee Azureen olla luotuna vastaavat Azure App:t. **Service Principalia / S2S App useria ei saa luoda ennen PVA botin lisäämistä Power Platform ympäristöön manuaalisesti** vaan se syntyy automaattisesti PVA Agent Transfer määrityksen seurauksena. Jos tämän tekee ennalta manuaalisesti kaatuu PVA chatbotin lisääminen virheeseen.

Oletuksena PVA chatbot saa "käyttäjän" sukunimen nimen Azure Appin nimeämisen perusteella. Huom! Botin etunimi on loppukäyttäjille näkyvissä ja se tulee vaihtaa oikeaksi. Sukunimeä ei pysty vaihtamaan.

Em. operaation jälkeen PVA chatbot on saatavilla Omnichannelin admin centerissä ja liitettävissä workstream- objektiin tarvittavien asetusten mukaisesti.