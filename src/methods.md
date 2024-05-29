# Méthodologie

<head>
<link rel="stylesheet" href="style.css">
</head>

Dans cette section, nous allons discuter de la méthodologie que nous avons utilisée afin d'étudier l'évolution des différentes industries situées au bord du Flon et de la Louve et répondre à la problématique posée précédemment. Tout d'abord, nous avons décidé d'utiliser comme sources principales les cadastres de Lausanne à 3 temporalités différentes: le cadastre Melotte (1727), le cadastre Berney (1831), et le cadastre Rénové (1885). L'Almanach du commerce de 1832, l'Indicateur Vaudois de 1888 ainsi que des sources iconographiques ont été utilisés comme sources complémentaires afin de compléter les informations présentes sur les différents cadastres. Ci-dessous sont expliqués les différents processus employés pour traiter les sources et en tirer les informations souhaitées.

<div class="card">
<h2>Cadastres</h2>

Le but est d'obtenir une cartographie et une table d'attributs correspondante comportant au minimum l'utilisation de la parcelle et le nom du propriétaire.

- **Melotte 1727:** Le cadastre source a été étudié manuellement (raster + archives). Toute la légende est présente sur la cartographie elle-même, nous l'avons recopiée depuis les planches pour les bâtiments intéressants.

- **Berney 1831:** La table d'attributs était déjà très complète, et la légende du cadastre était déjà reprise dans la table d'attributs.

- **Rénové 1888:** Il a été nécessaire de créer des couches contenant les numéros des parcelles, le tracé des rues et les toponymes. Un processus de fusion de ces couches avec la légende du cadastre nous a permis d'obtenir une table d'attributs exploitable pour les bâtiments que nous avions repérés comme intéressants.

</div>
<div class="card">
<h2>Iconographie</h2>

L'iconographie est accompagnée d'un tableau sous forme Excel contenant le numéro des images, ainsi que des informations supplémentaires telles que des indications sur le média en lui-même (date, type, titre, description du sujet), mais également des remarques historiques sur les bâtiments, les utilisations et les propriétaires.
L'iconographie a été filtrée par mots-clés afin d'identifier les photos pertinentes au projet. Les mots-clés principaux tels que "moulin", "tannerie", "scie" ou "forge" ont généré une grande quantité d'images souvent redondantes des bâtiments industriels. La liste de mots-clés a été complétée graduellement grâce aux descriptions.

Les images ont ensuite été filtrées une deuxième fois par noms récurrents afin de trouver toutes les photographies associées à ce nom. Enfin, les images restantes ont été triées à la main afin d'identifier les industries qui se situaient bel et bien au bord du Flon et de la Louve. A partir de ces images filtrées, l'identification des bâtiments uniques et l'attribution des images à certains bâtiments spécifiques a pu être complétée. Ceci nous donne une liste de bâtiments sur lesquels les informations sont particulièrement riches, et leurs images associées.

</div>
<div class="card">
<h2>Indicateur Vaudois / Almanach du commerce</h2>

Grâce au logiciel Inception, l'Indicateur Vaudois de 1885 et l'Almanach du commerce de 1832 ont été transformés au format Excel pour faciliter la recherche et l'identification des données pertinentes au projet. En effet, en employant une procédure d'apprentissage automatique, le logiciel Inception a transformé les sources qui étaient au format de texte non formaté en fichier Excel où les catégories d'information (nom, prénom, domaine professionnel, adresse, ...)  étaient séparées par colonne. Ces informations ont principalement servi à compléter les informations manquantes obtenues dans les cadastres (adresses, prénom, nom).

</div>
<div class="card">
<h2>Liaison des différentes sources</h2>

En ce qui concerne le cadastre Melotte, aucune source complémentaire n'a pu y être reliée, par manque de sources provenant de la même époque que le cadastre (1727). Ainsi, les seules informations sur les industries au bord du Flon et de la Louve provenant de cette époque ont été déduites des utilisations des parcelles sur le cadastre, et des quelques remarques historiques de l'iconographie remontant assez loin.

Concernant le cadastre Berney, les sources complémentaires pertinentes étaient l'Almanach du commerce de 1832 et l'iconographie.

Concernant le cadastre Rénové, les sources complémentaires pertinentes étaient l'Indicateur Vaudois de 1885 et l'iconographie. L'iconographie est particulièrement riche à partir de la fin du XIXe siècle grâce au nombre de photos plus importantes.

Afin de relier les informations de toutes les sources complémentaires à la source principale, nous avons inséré manuellement ces informations dans la table d'attribut des cadastres sur le logiciel QGIS.

Concernant l'iconographie, un nouveau champ a été ajouté à la table des attributs de chaque cadastre contenant le numéro du bâtiment de l'iconographie. Le numéro des bâtiments de l'iconographie a ainsi pu être associé au bâtiment correspondant sur le cadastre, en s'aidant des photos et des descriptions pour le replacer correctement sur la carte.

Pour l'intégration finale avec ce site Web, les couches de bâtiments identifiés sur les cadastres (avec leur numéro de bâtiment de l'iconographie, si présent) ont été exportés en format GeoJSON. Les fichiers ont été filtrés par un script afin de supprimer les attributs inutiles, et d'obtenir une nomenclature des attributs commune aux trois cadastres. D'autre part, les informations des bâtiments identifiés dans l'iconographie et de leurs images associées ont été fusionnées en un seul fichier JSON.

```js
FileAttachment("./data/static_images/diagram.png").image({width: 650})
```

</div>
<div class="card">
<h2>Limites et difficultés</h2>

Une des principale limites de l'analyse était la faible quantité d'information pertinente qui pouvait être extraite de l'Almanach et de l'Indicateur. En effet, seulement environ le tiers des bâtiments identifiés dans le cadastre Berney ont pu être reliés à un propriétaire ou employé trouvé dans l'Almanach du commerce. Dans le cas du cadastre Rénové, environ deux tiers des bâtiments ont pu être reliés à un propriétaire ou employé trouvé dans l'Indicateur Vaudois.

En utilisant l'iconographie, il est important de noter que nous n'avons pu identifié que 15 bâtiments faisant partie de notre cadre d'étude. Naturellement, les points de vue des photos ne sont pas distribués uniformément mais très groupés, ce qui cause un biais dans la quantité d'informations disponible pour certains bâtiments.

Le projet a été limité davantage par la difficulté d'identifier la date de construction et de démolition de chaque industrie au bord du Flon et de la Louve. Puisque trois cadastres ont été utilisés comme source dans le projet, il aurait fallu visuellement inspecter les cartes des années entre les trois cadastres pour vérifier quels bâtiments étaient présents et lesquels avaient apparus/disparus. Cette tâche présentait un grand défi car la géométrie des terrains et des rues était souvent fortement déformée sur les cartes comparé aux cadastres, ce qui complexifiait l'identification des lieux pertinents.

</div>
