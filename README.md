# CLIM- : boutique MaxiPower

Site marchand de climatiseurs MaxiPower, vendus et posés en France et en Europe
par HM CLIM. Deux parcours distincts, particulier et professionnel.

## Ce que contient le dépôt

- `source/corps.html` : le corps commun à toutes les pages. **C'est ici qu'on
  modifie le site**, pas dans les pages fabriquées.
- `source/pages.json` : la liste des pages, avec pour chacune son adresse,
  l'écran qu'elle ouvre, son titre et sa description.
- `construire.py` : fabrique les pages depuis ces deux fichiers, plus
  `sitemap.xml` et `robots.txt`.
- `style.css` et `boutique.js` : le style et le code, partagés par toutes les
  pages.
- `medias/` : la vidéo d'atelier et les photos qui en sont tirées.
- Les dossiers `catalogue/`, `professionnels/`, `conditions-de-vente/` et les autres sont
  **fabriqués** : toute modification directe sera écrasée.

## Modifier le site

1. Changer `source/corps.html`, `style.css` ou `boutique.js`.
2. Lancer `python3 construire.py`.
3. Vérifier dans un navigateur, puis commiter et pousser.

Une page en plus : ajouter son entrée dans `source/pages.json`, ajouter son
chemin dans `PAGES` au début de `boutique.js`, relancer le générateur.

## Ouvrir le site

`python3 -m http.server` à la racine, puis ouvrir l'adresse indiquée. Un simple
double-clic sur `index.html` marche aussi, mais les liens entre pages sont
écrits pour un serveur.

Le site est servi par GitHub Pages depuis la branche `main` :
https://chm75009-sketch.github.io/CLIM-/

## Ce qu'on y trouve

Catalogue de dix splits tropicalisés et quatre accessoires, calcul de puissance
en BTU, comparateur, panier et commande. Côté professionnel : évaluation des
besoins métier par métier (hôtel, restaurant, bar, bureau, autre activité),
devis chiffré derrière l'ouverture d'un compte avec SIRET et Kbis. Un outil
« Où poser le groupe » indique les démarches d'urbanisme, de copropriété et de
voisinage, avec la source de chaque réponse.

Quatre pages légales : mentions légales, conditions générales de vente
(particuliers et professionnels), politique de confidentialité et registre des
traitements au sens de l'article 30 du règlement européen. Un écran séparé
permet de se rétracter en ligne et reprend le formulaire type.

## Ce qui reste à faire

- le juridique de fond : où partent les formulaires et l'extrait Kbis, les avis
  clients affichés qui sont pour l'instant inventés, les polices chargées chez
  Google qui contredisent la politique de confidentialité ;
- l'étiquette énergétique, la fiche produit européenne et l'éco-participation ;
- brancher un paiement et un transporteur réels ;
- compléter l'hébergeur, le prestataire de paiement et le médiateur de la
  consommation, notés « à compléter » dans les pages légales ;
- remplacer les chiffres d'exemple et les dessins techniques par de vraies
  photos de produits ;
- immatriculer HM CLIM, pour le SIRET, le RCS et le numéro de TVA.
