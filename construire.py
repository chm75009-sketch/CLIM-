#!/usr/bin/env python3
"""Fabrique les pages du site à partir de source/corps.html et source/pages.json.

Un seul corps, une page par écran. Chaque page reçoit son adresse, son titre,
sa description et sa balise canonique ; les chemins des fichiers joints sont
réécrits selon la profondeur de la page. Lancer : python3 construire.py
"""

import json
import os
import re
import shutil
from datetime import date

RACINE = os.path.dirname(os.path.abspath(__file__))
SITE = "https://chm75009-sketch.github.io/CLIM-"
VERSION = "1.0"

# Les écrans qui n'ont pas de page à eux : fiche produit, tunnel de commande,
# confirmation. Ils restent accessibles par le code, sans adresse propre.
SANS_PAGE = {"produit", "commande", "fini"}


def lire(nom):
    with open(os.path.join(RACINE, nom), encoding="utf-8") as f:
        return f.read()


def adresses(pages):
    """Donne, pour chaque cible de lien, le chemin de la page correspondante."""
    par_ecran, par_onglet = {}, {}
    for p in pages:
        if p.get("onglet"):
            par_onglet[p["onglet"]] = p["chemin"]
        elif p["ecran"] not in par_ecran:
            par_ecran[p["ecran"]] = p["chemin"]
    return par_ecran, par_onglet


def poser_liens(corps, prefixe, par_ecran, par_onglet):
    """Ajoute un href aux liens qui mènent à une page, pour qu'ils se partagent."""

    def href(cible, table):
        chemin = table.get(cible)
        if chemin is None:
            return None
        return (prefixe + chemin + "/") if chemin else (prefixe or "./")

    def sur_lien(m):
        balise = m.group(0)
        if "href=" in balise:
            return balise
        a = re.search(r'data-aller="([^"]+)"', balise)
        l = re.search(r'data-legal="([^"]+)"', balise)
        cible = href(a.group(1), par_ecran) if a else (href(l.group(1), par_onglet) if l else None)
        if not cible:
            return balise
        return balise.replace("<a ", '<a href="%s" ' % cible, 1)

    return re.sub(r'<a [^>]*data-(?:aller|legal)="[^"]+"[^>]*>', sur_lien, corps)


MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
        "août", "septembre", "octobre", "novembre", "décembre"]


def en_toutes_lettres(j):
    return "%d %s %d" % (j.day, MOIS[j.month - 1], j.year)


def poser_reperes(corps):
    """Remplit l'adresse et la version affichées au bas de l'accueil."""
    court = SITE.split("://", 1)[1]
    return (corps.replace("[[SITE_COURT]]", court)
                 .replace("[[SITE]]", SITE)
                 .replace("[[VERSION]]", VERSION)
                 .replace("[[DATE]]", en_toutes_lettres(date.today())))


def poser_chemins(corps, prefixe):
    """Réécrit les chemins des médias selon la profondeur de la page."""
    if not prefixe:
        return corps
    return re.sub(r'(src|poster)="medias/', lambda m: '%s="%smedias/' % (m.group(1), prefixe), corps)


def fabriquer():
    corps_source = lire("source/corps.html")
    pages = json.loads(lire("source/pages.json"))
    par_ecran, par_onglet = adresses(pages)

    for p in pages:
        chemin = p["chemin"]
        prefixe = "../" if chemin else ""
        corps = poser_reperes(corps_source)
        corps = poser_chemins(corps, prefixe)
        corps = poser_liens(corps, prefixe, par_ecran, par_onglet)

        canonique = SITE + "/" + (chemin + "/" if chemin else "")
        attributs = ' data-ecran="%s"' % p["ecran"]
        if p.get("onglet"):
            attributs += ' data-onglet="%s"' % p["onglet"]

        page = PATRON.format(
            titre=p["titre"],
            description=p["description"].replace('"', "&quot;"),
            canonique=canonique,
            prefixe=prefixe,
            attributs=attributs,
            corps=corps.strip(),
        )

        dossier = os.path.join(RACINE, chemin) if chemin else RACINE
        os.makedirs(dossier, exist_ok=True)
        with open(os.path.join(dossier, "index.html"), "w", encoding="utf-8") as f:
            f.write(page)
        print("écrit :", os.path.join(chemin, "index.html") if chemin else "index.html")

    ecrire_plan(pages)
    ecrire_robots()


def ecrire_plan(pages):
    jour = date.today().isoformat()
    lignes = ['<?xml version="1.0" encoding="UTF-8"?>',
              '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for p in pages:
        adresse = SITE + "/" + (p["chemin"] + "/" if p["chemin"] else "")
        priorite = "1.0" if not p["chemin"] else ("0.8" if p["ecran"] in ("catalogue", "pro") else "0.5")
        lignes += ["  <url>", "    <loc>%s</loc>" % adresse,
                   "    <lastmod>%s</lastmod>" % jour,
                   "    <priority>%s</priority>" % priorite, "  </url>"]
    lignes.append("</urlset>")
    with open(os.path.join(RACINE, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write("\n".join(lignes) + "\n")
    print("écrit : sitemap.xml")


def ecrire_robots():
    with open(os.path.join(RACINE, "robots.txt"), "w", encoding="utf-8") as f:
        f.write("User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n" % SITE)
    print("écrit : robots.txt")


PATRON = """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{titre}</title>
<meta name="description" content="{description}">
<link rel="canonical" href="{canonique}">
<meta name="theme-color" content="#101010">
<meta property="og:type" content="website">
<meta property="og:site_name" content="MaxiPower">
<meta property="og:title" content="{titre}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{canonique}">
<link rel="icon" href="data:,">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,400..900&family=Anton&family=Public+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap">
<link rel="stylesheet" href="{prefixe}style.css">
</head>
<body{attributs}>

{corps}

<script src="{prefixe}boutique.js"></script>
</body>
</html>
"""

if __name__ == "__main__":
    fabriquer()
