(function(){
  "use strict";

  var POSE = 690, CLE = "mp-panier-proto";

  /* ---------- adresses ----------
     Chaque écran qui a sa page porte son chemin ici. Le reste (fiche produit,
     commande, confirmation) vit sans adresse propre. */
  var PAGES = { accueil: "", catalogue: "catalogue", pro: "professionnels",
    pose: "ou-poser-le-groupe", infos: "livraison-pose-garantie",
    panier: "panier", retractation: "retractation" };
  var PAGES_LEGAL = { mentions: "mentions-legales", cgv: "conditions-de-vente",
    donnees: "donnees-personnelles", registre: "registre-rgpd" };

  var depart = document.body.dataset.ecran || "accueil";
  var departOnglet = document.body.dataset.onglet || "";

  /* La racine du site, déduite de l'adresse courante et du chemin de la page
     ouverte : le site marche aussi bien sous un domaine que dans un
     sous-dossier. */
  var BASE = (function(){
    var chemin = depart === "legal" ? PAGES_LEGAL[departOnglet] : PAGES[depart];
    var ici = location.pathname.replace(/index\.html$/, "");
    if (chemin) {
      var queue = chemin + "/";
      if (ici.slice(-queue.length) === queue) ici = ici.slice(0, -queue.length);
    }
    return ici.charAt(ici.length - 1) === "/" ? ici : ici + "/";
  })();

  function adresse(ecran, onglet){
    var chemin = ecran === "legal" ? PAGES_LEGAL[onglet || legalActif] : PAGES[ecran];
    return chemin === undefined ? null : BASE + (chemin ? chemin + "/" : "");
  }

  function noterAdresse(ecran, onglet){
    var a = adresse(ecran, onglet);
    if (a && a !== location.pathname) {
      try { history.pushState({ ecran: ecran, onglet: onglet || null }, "", a); } catch (e) {}
    }
  }

  var GAMME = [
    {ref:"T3ACMAX12XA51", nom:"Tropical 12 Classe A", btu:12000, tech:"classe", prix:449, kw:3.5, surf:[14,24], classe:"A", seer:"5,1", scop:"3,8", fluide:"R410A", db:38, conso:340, wifi:false, dim:"77 x 25 x 19 cm", note:4.3, avis:212, mot:"Le plus vendu en chambre"},
    {ref:"T3ACMAX18XA51", nom:"Tropical 18 Classe A", btu:18000, tech:"classe", prix:649, kw:5.2, surf:[24,36], classe:"A", seer:"5,1", scop:"3,8", fluide:"R410A", db:42, conso:505, wifi:false, dim:"92 x 30 x 21 cm", note:4.2, avis:151, mot:""},
    {ref:"T3ACMAX24XA51", nom:"Tropical 24 Classe A", btu:24000, tech:"classe", prix:899, kw:7.0, surf:[36,52], classe:"A", seer:"5,0", scop:"3,7", fluide:"R410A", db:46, conso:680, wifi:false, dim:"105 x 32 x 23 cm", note:4.1, avis:118, mot:""},
    {ref:"T3ACMAX12XA82", nom:"Tropical 12 Noir", btu:12000, tech:"classe", prix:529, kw:3.5, surf:[14,24], classe:"A", seer:"5,1", scop:"3,8", fluide:"R410A", db:38, conso:340, wifi:false, dim:"77 x 25 x 19 cm", note:4.4, avis:87, mot:"Façade noire", noir:true},
    {ref:"T3ACMAX18XA82", nom:"Tropical 18 Noir", btu:18000, tech:"classe", prix:729, kw:5.2, surf:[24,36], classe:"A", seer:"5,1", scop:"3,8", fluide:"R410A", db:42, conso:505, wifi:false, dim:"92 x 30 x 21 cm", note:4.3, avis:96, mot:"Façade noire", noir:true},
    {ref:"INVACMAX12XA71", nom:"Inverter 12 Tropical", btu:12000, tech:"inverter", prix:599, kw:3.5, surf:[14,26], classe:"A++", seer:"7,1", scop:"4,2", fluide:"R32", db:33, conso:210, wifi:false, dim:"80 x 27 x 20 cm", note:4.6, avis:174, mot:""},
    {ref:"INVACMAX18XA71", nom:"Inverter 18 Tropical", btu:18000, tech:"inverter", prix:849, kw:5.2, surf:[24,38], classe:"A++", seer:"7,2", scop:"4,3", fluide:"R32", db:35, conso:305, wifi:false, dim:"96 x 31 x 22 cm", note:4.6, avis:263, mot:"", vedette:true},
    {ref:"INVACMAX24XA71", nom:"Inverter 24 Tropical", btu:24000, tech:"inverter", prix:1149, kw:7.0, surf:[36,55], classe:"A++", seer:"7,0", scop:"4,2", fluide:"R32", db:38, conso:415, wifi:false, dim:"108 x 33 x 24 cm", note:4.5, avis:187, mot:"Salon et cuisine ouverte", vedette:true},
    {ref:"INVACMAX12XA71-S", nom:"Inverter Smart 12", btu:12000, tech:"inverter", prix:699, kw:3.5, surf:[14,26], classe:"A++", seer:"7,4", scop:"4,4", fluide:"R32", db:31, conso:200, wifi:true, dim:"80 x 27 x 20 cm", note:4.7, avis:308, mot:"Pilotage par téléphone", vedette:true},
    {ref:"INVACMAX18XA71-S", nom:"Inverter Smart 18", btu:18000, tech:"inverter", prix:929, kw:5.2, surf:[24,38], classe:"A+++", seer:"8,6", scop:"4,9", fluide:"R32", db:33, conso:290, wifi:true, dim:"96 x 31 x 22 cm", note:4.8, avis:421, mot:"Le meilleur rendement de la gamme"}
  ];

  var ACCESSOIRES = [
    {ref:"ACC-KIT4", nom:"Kit de liaison 4 m", tech:"accessoire", prix:149, note:4.5, avis:91, texte:"Cuivre isolé 1/4 et 3/8, câble d'interconnexion et gaine de condensats. La longueur qui suffit dans neuf poses sur dix."},
    {ref:"ACC-SUP", nom:"Support mural antivibratile", tech:"accessoire", prix:59, note:4.6, avis:143, texte:"Acier galvanisé, 160 kg, plots caoutchouc fournis. C'est lui qui évite que le groupe fasse vibrer le mur du voisin."},
    {ref:"ACC-CACHE", nom:"Cache-groupe a lames", tech:"accessoire", prix:129, note:4.4, avis:67, texte:"Lames ajourées, aucun étranglement du débit d'air. Utile quand la copropriété regarde la façade."},
    {ref:"ACC-ENTRETIEN", nom:"Visite d'entretien annuelle", tech:"accessoire", prix:129, note:4.7, avis:58, texte:"Nettoyage des échangeurs et des filtres, contrôle des pressions et du bac a condensats, une fois par an."}
  ];

  var TOUT = GAMME.concat(ACCESSOIRES);

  var $ = function(s){ return document.querySelector(s); };
  var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var mono = function(n){ return n.toLocaleString("fr-FR").replace(/ | /g, " "); };
  var euros = function(n){ return mono(n) + " €"; };
  var trouver = function(ref){ return TOUT.filter(function(p){ return p.ref === ref; })[0]; };
  var etoiles = function(n){ return "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n)); };

  /* Planches techniques : vue de face, vue de profil, groupe extérieur.
     Trait noir, cotation, hachures, un seul accent orange. */
  function visuel(p, vue){
    var trait = "#2A2721", accent = "#B2552C", gris = "#736D62", papier = "#F2EEE3";
    vue = vue || "face";

    if (!p.btu) {
      return '<svg viewBox="40 30 320 180" aria-hidden="true">' +
        '<rect x="120" y="60" width="160" height="120" fill="#fff" stroke="' + trait + '" stroke-width="2"/>' +
        '<g stroke="' + trait + '" stroke-width="1.2" opacity=".5"><path d="M120 90 h160"/><path d="M120 120 h160"/><path d="M120 150 h160"/></g>' +
        '<circle cx="200" cy="120" r="46" fill="none" stroke="' + accent + '" stroke-width="2" stroke-dasharray="6 6"/></svg>';
    }

    var noir = !!p.noir;
    var fond = noir ? "#161616" : "#ffffff";
    var ligne = noir ? "rgba(255,255,255,.55)" : "#C9C5BB";
    var cotes = (p.dim || "").replace(" cm", "").split(" x ");
    var L = cotes[0] || "", H = cotes[1] || "", P = cotes[2] || "";

    if (vue === "groupe") {
      return '<svg viewBox="40 26 320 188" aria-hidden="true">' +
        '<defs><pattern id="h' + p.ref + '" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">' +
        '<line x1="0" y1="0" x2="0" y2="6" stroke="' + gris + '" stroke-width="1" opacity=".45"/></pattern></defs>' +
        '<rect x="96" y="52" width="208" height="126" fill="#fff" stroke="' + trait + '" stroke-width="2"/>' +
        '<circle cx="176" cy="115" r="48" fill="none" stroke="' + trait + '" stroke-width="2"/>' +
        '<circle cx="176" cy="115" r="38" fill="none" stroke="' + gris + '" stroke-width="1"/>' +
        '<circle cx="176" cy="115" r="26" fill="none" stroke="' + gris + '" stroke-width="1"/>' +
        '<circle cx="176" cy="115" r="8" fill="' + accent + '"/>' +
        '<path d="M176 107 a8 8 0 0 1 30 8" fill="none" stroke="' + accent + '" stroke-width="2.5"/>' +
        '<rect x="240" y="66" width="52" height="98" fill="url(#h' + p.ref + ')" stroke="' + trait + '" stroke-width="1.5"/>' +
        '<rect x="112" y="178" width="24" height="10" fill="' + trait + '"/>' +
        '<rect x="264" y="178" width="24" height="10" fill="' + trait + '"/>' +
        '<text x="200" y="42" text-anchor="middle" font-family="Space Mono, monospace" font-size="10" letter-spacing="3" fill="' + gris + '">GROUPE EXTÉRIEUR</text>' +
        '</svg>';
    }

    if (vue === "profil") {
      return '<svg viewBox="40 26 320 188" aria-hidden="true">' +
        '<path d="M150 70 h120 a14 14 0 0 1 14 14 v40 a22 22 0 0 1 -14 20 h-120 z" fill="' + fond + '" stroke="' + trait + '" stroke-width="2"/>' +
        '<path d="M150 70 v74" stroke="' + trait + '" stroke-width="3"/>' +
        '<path d="M168 140 l84 -10" stroke="' + accent + '" stroke-width="2.5"/>' +
        '<g stroke="' + trait + '" stroke-width="1"><path d="M150 164 v14"/><path d="M284 164 v14"/><path d="M150 171 h134"/></g>' +
        '<rect x="186" y="164" width="62" height="14" fill="' + papier + '"/>' +
        '<text x="217" y="175" text-anchor="middle" font-family="Space Mono, monospace" font-size="10" fill="#4B463D">' + (P ? P + " cm" : "") + '</text>' +
        '<text x="200" y="42" text-anchor="middle" font-family="Space Mono, monospace" font-size="10" letter-spacing="3" fill="' + gris + '">PROFIL, PROFONDEUR</text>' +
        '</svg>';
    }

    var largeur = p.btu === 24000 ? 272 : (p.btu === 18000 ? 244 : 214);
    var x = (400 - largeur) / 2, y = 62, h = 78;
    var lames = "";
    for (var i = 0; i < 4; i++) {
      lames += '<path d="M' + (x + 16) + " " + (y + h - 26 + i * 6) + " h" + (largeur - 32) + '"/>';
    }
    return '<svg viewBox="30 26 340 190" aria-hidden="true">' +
      '<text x="200" y="150" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="150" fill="#2A2721" opacity=".05">' + p.btu / 1000 + 'K</text>' +
      '<rect x="' + x + '" y="' + y + '" width="' + largeur + '" height="' + h + '" rx="10" fill="' + fond + '" stroke="' + trait + '" stroke-width="2"/>' +
      '<path d="M' + x + " " + (y + h - 30) + " h" + largeur + '" stroke="' + trait + '" stroke-width="1.2" opacity=".6"/>' +
      '<g stroke="' + ligne + '" stroke-width="1.1">' + lames + '</g>' +
      '<rect x="' + (x + largeur - 62) + '" y="' + (y + 18) + '" width="44" height="13" rx="2" fill="' + (noir ? "#000" : "#2A2721") + '" opacity=".85"/>' +
      '<text x="' + (x + largeur - 40) + '" y="' + (y + 28) + '" text-anchor="middle" font-family="Space Mono, monospace" font-size="8.5" fill="#E7B893">' + (p.btu / 1000) + 'K</text>' +
      '<circle cx="' + (x + largeur - 74) + '" cy="' + (y + 24) + '" r="3.5" fill="' + accent + '"/>' +
      '<text x="' + (x + 18) + '" y="' + (y + 28) + '" font-family="Space Mono, monospace" font-size="9" letter-spacing="2.5" fill="' + (noir ? "#A39B8C" : "#736D62") + '">MAXIPOWER</text>' +
      '<path d="M' + (x + 18) + " " + (y + 40) + " h" + Math.round(largeur * 0.42) + '" stroke="' + ligne + '" stroke-width="1"/>' +
      '<g stroke="' + trait + '" stroke-width="1"><path d="M' + x + ' 158 v16"/><path d="M' + (x + largeur) + ' 158 v16"/><path d="M' + x + ' 166 h' + largeur + '"/></g>' +
      '<rect x="' + (200 - 30) + '" y="158" width="60" height="16" fill="' + papier + '"/>' +
      '<text x="200" y="170" text-anchor="middle" font-family="Space Mono, monospace" font-size="10" fill="#4B463D">' + (L ? L + " cm" : "") + '</text>' +
      '<g stroke="' + accent + '" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".9">' +
      '<path d="M148 192 q26 14 52 0"/><path d="M204 202 q26 14 52 0"/></g>' +
      '<text x="' + (x + largeur + 6) + '" y="' + (y + h + 4) + '" font-family="Space Mono, monospace" font-size="9" fill="' + gris + '">H. ' + (H || "") + '</text>' +
      '</svg>';
  }

  /* ---------- métiers professionnels ---------- */
  var POSE_PRO = 590;

  var PICTO = {
    hotel: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 20V6h18v14"/><path d="M3 20h18"/><path d="M7 10h4M7 14h4M15 10h2M15 14h2"/></svg>',
    restaurant: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3v8a2 2 0 0 0 4 0V3"/><path d="M8 11v10"/><path d="M17 3c-1.5 1.5-2 3-2 5s.5 2 2 2 2 0 2-2-.5-3.5-2-5z"/><path d="M17 10v11"/></svg>',
    bar: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16l-8 8z"/><path d="M12 12v7"/><path d="M8 19h8"/></svg>',
    bureau: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    autre: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-7h6v7"/></svg>'
  };

  var METIERS = {
    hotel: {
      nom: "Hôtel", phrase: "Chambres silencieuses, hall toujours tempéré.",
      espaces: [
        { id: "chambre", nom: "Chambres", mode: "nb", nb: 24, surface: 18, coef: 450, silence: true, defaut: true },
        { id: "suite", nom: "Suites et junior suites", mode: "nb", nb: 0, surface: 34, coef: 450, silence: true },
        { id: "hall", nom: "Hall et réception", mode: "surface", surface: 60, coef: 550, public: true, defaut: true },
        { id: "petitdej", nom: "Salle de petit-déjeuner", mode: "surface", surface: 45, coef: 600, public: true },
        { id: "seminaire", nom: "Salle de séminaire", mode: "nb", nb: 0, surface: 35, coef: 700, public: true },
        { id: "backoffice", nom: "Bureaux et back-office", mode: "surface", surface: 20, coef: 450 }
      ]
    },
    restaurant: {
      nom: "Restaurant", phrase: "Salle chargée, cuisine à côté.",
      espaces: [
        { id: "salle", nom: "Salle de restaurant", mode: "surface", surface: 90, coef: 600, public: true, defaut: true },
        { id: "terrasse", nom: "Terrasse couverte", mode: "surface", surface: 0, coef: 700, public: true },
        { id: "bar", nom: "Coin bar", mode: "surface", surface: 15, coef: 700, public: true },
        { id: "cuisine", nom: "Cuisine", mode: "surface", surface: 40, coef: 0, etude: true },
        { id: "reserve", nom: "Réserve et chambre froide séchée", mode: "surface", surface: 20, coef: 400, continu: true },
        { id: "bureau", nom: "Bureau et vestiaire", mode: "surface", surface: 15, coef: 450, defaut: true }
      ]
    },
    bar: {
      nom: "Bar", phrase: "Debout, serré, tard le soir.",
      espaces: [
        { id: "salle", nom: "Salle", mode: "surface", surface: 70, coef: 700, public: true, defaut: true },
        { id: "terrasse", nom: "Terrasse couverte", mode: "surface", surface: 0, coef: 700, public: true },
        { id: "arriere", nom: "Arrière-bar et office", mode: "surface", surface: 12, coef: 550, defaut: true },
        { id: "cave", nom: "Cave à vin ou à bière", mode: "surface", surface: 12, coef: 500, continu: true },
        { id: "reserve", nom: "Réserve", mode: "surface", surface: 20, coef: 400 }
      ]
    },
    bureau: {
      nom: "Bureau", phrase: "Écrans, monde, salles fermées.",
      espaces: [
        { id: "plateau", nom: "Plateau ouvert", mode: "surface", surface: 160, coef: 500, public: true, defaut: true },
        { id: "ferme", nom: "Bureaux fermés", mode: "nb", nb: 4, surface: 14, coef: 450, defaut: true },
        { id: "reunion", nom: "Salles de réunion", mode: "nb", nb: 2, surface: 25, coef: 700, public: true, defaut: true },
        { id: "accueil", nom: "Accueil et circulations", mode: "surface", surface: 30, coef: 450 },
        { id: "cafeteria", nom: "Cafétéria", mode: "surface", surface: 25, coef: 600, public: true },
        { id: "serveur", nom: "Local serveur", mode: "surface", surface: 8, coef: 900, continu: true }
      ]
    },
    autre: {
      nom: "Autre activité", phrase: "Commerce, cabinet, salle de sport, atelier.",
      espaces: [
        { id: "principal", nom: "Espace principal, recevant du public", mode: "surface", surface: 80, coef: 550, public: true, defaut: true },
        { id: "second", nom: "Second espace", mode: "nb", nb: 0, surface: 30, coef: 500 },
        { id: "bureaux", nom: "Bureaux", mode: "surface", surface: 20, coef: 450 },
        { id: "accueil", nom: "Accueil et circulations", mode: "surface", surface: 25, coef: 450, public: true },
        { id: "technique", nom: "Réserve ou local technique", mode: "surface", surface: 15, coef: 400, continu: true }
      ]
    }
  };

  var ETAPES = [
    { cle: "espaces", titre: "Les espaces à traiter", sous: "Cochez ce qui doit être climatisé, donnez la surface réelle au sol et la hauteur sous plafond. C'est ce qui pèse le plus dans le calcul." },
    { cle: "public", titre: "Le public et les horaires", sous: "Une personne dégage environ 350 BTU par heure. Cent couverts un soir d'août, ce n'est pas la même machine qu'une salle vide." },
    { cle: "bati", titre: "Le bâtiment", sous: "Même surface, même public : entre un immeuble ancien plein sud et un local isolé au nord, la puissance varie du simple au tiers en plus." },
    { cle: "apports", titre: "Les apports de chaleur", sous: "Tout ce qui chauffe dans la pièce se paye en froid : pianos, vitrines, écrans, éclairage." },
    { cle: "chantier", titre: "Le chantier", sous: "Ce qui décide le prix de la pose : où va le groupe, quelle longueur de liaison, quel accès, quelles autorisations." },
    { cle: "synthese", titre: "Synthèse", sous: "Le calcul espace par espace, le matériel proposé, le prix, et les points qui demandent une visite." }
  ];

  var reponses = null;

  function reponsesNeuves(cle){
    var r = { espaces: {}, public: {}, bati: {}, apports: {}, chantier: {} };
    METIERS[cle].espaces.forEach(function(e){
      r.espaces[e.id] = { actif: !!e.defaut, nb: e.nb || 1, surface: e.surface, hauteur: "2,5" };
    });
    r.public = { affluence: 40, amplitude: "service", jours: "6", saison: "ete" };
    r.bati = { annee: "1975", isolation: "moyenne", vitrage: "double", exposition: "sud", dernier: "non", vitre: "moyenne" };
    r.apports = { cuisine: false, vitrines: false, ecrans: false, eclairage: false, machines: false };
    r.chantier = { groupe: "cour", liaison: 6, nacelle: "non", autorisation: "non", bruit: "non", elec: "mono", occupe: "oui", depose: "non", delai: "mois" };
    return r;
  }

  function ht(n){ return Math.round(n / 1.2); }

  /* ---------- compte professionnel ---------- */
  var CLE_PRO = "mp-compte-pro";
  var societe = null;

  function lireSociete(){
    try { societe = JSON.parse(localStorage.getItem(CLE_PRO)) || null; } catch (e) { societe = null; }
  }
  function ecrireSociete(){
    try { localStorage.setItem(CLE_PRO, JSON.stringify(societe)); } catch (e) {}
  }

  /* La clé de contrôle d'un SIRET se vérifie par la formule de Luhn. */
  function siretValide(v){
    var n = v.replace(/\D/g, "");
    if (n.length !== 14) return false;
    var somme = 0;
    for (var i = 0; i < 14; i++) {
      var c = +n.charAt(13 - i);
      if (i % 2 === 1) { c *= 2; if (c > 9) c -= 9; }
      somme += c;
    }
    return somme % 10 === 0;
  }

  function facteurBati(){
    var b = reponses.bati, f = 1;
    if (b.isolation === "mauvaise") f *= 1.20;
    if (b.isolation === "bonne") f *= 0.92;
    if (b.vitrage === "simple") f *= 1.12;
    if (b.vitrage === "triple") f *= 0.96;
    if (b.exposition === "sud" || b.exposition === "ouest") f *= 1.10;
    if (b.dernier === "oui") f *= 1.08;
    if (b.vitre === "importante") f *= 1.10;
    if (b.annee === "avant1975") f *= 1.10;
    if (b.annee === "neuf") f *= 0.94;
    return f;
  }

  function modele(besoin, silence){
    if (besoin <= 12500) return { ref: silence ? "INVACMAX12XA71-S" : "INVACMAX12XA71", cap: 12000 };
    if (besoin <= 19000) return { ref: "INVACMAX18XA71-S", cap: 18000 };
    return { ref: "INVACMAX24XA71", cap: 24000 };
  }

  function etude(){
    var m = METIERS[etat.metier], fb = facteurBati(), lignes = [], alertes = [], unites = 0;
    var surfacePublique = 0;

    m.espaces.forEach(function(e){
      var r = reponses.espaces[e.id];
      if (!r.actif) return;
      if (e.public) surfacePublique += r.surface * (e.mode === "nb" ? r.nb : 1);
    });

    var btuPublic = (+reponses.public.affluence || 0) * 350;
    if (reponses.public.amplitude === "continu") btuPublic *= 1.1;

    m.espaces.forEach(function(e){
      var r = reponses.espaces[e.id];
      if (!r.actif) return;
      var quantite = e.mode === "nb" ? Math.max(1, +r.nb || 1) : 1;

      if (e.etude) {
        alertes.push("La cuisine, " + r.surface + " m², se traite avec l'extraction existante : elle demande une visite et un chiffrage à part.");
        return;
      }

      var besoin = r.surface * e.coef * fb;
      if (r.hauteur === "3") besoin *= 1.12;
      if (r.hauteur === "3,5") besoin *= 1.22;
      if (e.public && surfacePublique > 0) besoin += btuPublic * (r.surface / surfacePublique);
      if (e.public && reponses.apports.cuisine) besoin *= 1.20;
      if (e.public && reponses.apports.vitrines) besoin *= 1.08;
      if (e.public && reponses.apports.eclairage) besoin *= 1.06;
      if (reponses.apports.ecrans && (e.id === "plateau" || e.id === "ferme" || e.id === "backoffice" || e.id === "bureau")) besoin *= 1.10;
      if (reponses.apports.machines && e.continu) besoin *= 1.15;

      besoin = Math.round(besoin);
      var mod = modele(besoin, e.silence);
      var parEspace = Math.max(1, Math.ceil(besoin / mod.cap));
      var total = parEspace * quantite;
      unites += total;

      lignes.push({ nom: e.nom, surface: r.surface, quantite: quantite, besoin: besoin,
        ref: mod.ref, unites: total, silence: !!e.silence, continu: !!e.continu });

      if (e.silence && reponses.public.amplitude === "nuit") alertes.push(e.nom + " : consigne de 31 dB retenue, le client dort à deux mètres de l'appareil.");
      if (e.continu) alertes.push(e.nom + " : marche continue, un appareil dédié est prévu, hors régulation générale.");
    });

    var c = reponses.chantier;
    var extras = [];
    var metresSup = Math.max(0, (+c.liaison || 0) - 4);
    if (metresSup > 0) extras.push({ nom: "Liaison frigorifique au-delà de 4 m, " + metresSup + " m par unité", prix: Math.round(metresSup * 45 * unites) });
    if (c.groupe === "toiture") extras.push({ nom: "Mise en oeuvre en toiture, plots et cheminement", prix: 350 });
    if (c.nacelle === "oui") extras.push({ nom: "Nacelle ou échafaudage, une journée", prix: 450 });
    if (c.depose === "oui") extras.push({ nom: "Dépose et récupération de l'ancien fluide", prix: 180 * unites });
    if (c.occupe === "oui") extras.push({ nom: "Intervention hors heures d'ouverture", prix: 90 * unites });

    if (c.autorisation === "oui") alertes.push("Accord de copropriété ou avis des bâtiments de France à obtenir avant la pose : comptez le délai dans le planning.");
    if (c.bruit === "oui") alertes.push("Contrainte de bruit sur le voisinage : groupe sur plots antivibratiles et écran acoustique, à confirmer en visite.");
    if (c.elec === "mono" && unites >= 6) alertes.push("Six unités ou plus en monophasé : la puissance du tableau et l'abonnement sont à vérifier avant commande.");
    if (c.delai === "urgent") alertes.push("Délai urgent demandé : la disponibilité des équipes est confirmée à la prise de rendez-vous.");
    if (reponses.public.saison === "annee") alertes.push("Usage toute l'année : le chauffage par la machine est pris en compte, vérifier le point de rosée en hiver.");

    var materiel = lignes.reduce(function(n, l){ return n + ht(trouver(l.ref).prix) * l.unites; }, 0);
    var taux = remise(unites);
    var pose = unites * POSE_PRO;
    var supplements = extras.reduce(function(n, e){ return n + e.prix; }, 0);
    var totalHT = Math.round(materiel * (1 - taux)) + pose + supplements;

    return { lignes: lignes, alertes: alertes, extras: extras, unites: unites,
      materiel: materiel, taux: taux, pose: pose, supplements: supplements, totalHT: totalHT };
  }

  function remise(n){ return n >= 10 ? 0.15 : (n >= 6 ? 0.10 : (n >= 3 ? 0.05 : 0)); }

  /* ---------- état ---------- */
  var comparaison = [];
  var etat = { ecran: "accueil", produit: null, btuConseille: 12000, mode: "part", metier: "hotel", demandeDevis: false,
    filtres: { btu: [], tech: [], surface: [], wifi: false, silence: false, prix: 1300 }, q: "", tri: "conseil" };
  var panier = [];

  function enregistrer(){ try { localStorage.setItem(CLE, JSON.stringify(panier)); } catch (e) {} }
  function relire(){
    try {
      var d = JSON.parse(localStorage.getItem(CLE));
      if (Array.isArray(d)) panier = d.filter(function(l){ return trouver(l.ref); });
    } catch (e) { panier = []; }
  }

  /* ---------- navigation ---------- */
  function aller(ecran, ref){
    etat.ecran = ecran;
    if (ref) etat.produit = ref;
    $$(".ecran").forEach(function(e){ e.classList.toggle("actif", e.id === "ecran-" + ecran); });
    $$("nav.liens a").forEach(function(a){ a.classList.toggle("actif", a.dataset.aller === ecran); });
    if (ecran === "produit") fiche();
    if (ecran === "panier") dessinerPanier();
    if (ecran === "commande") dessinerRecapCommande();
    if (ecran === "catalogue") dessiner();
    if (ecran === "pro") dessinerPro();
    if (ecran === "pose") dessinerPose();
    if (ecran === "legal") dessinerLegal();
    if (ecran === "retractation") remettreRetractation();
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  /* ---------- informations légales ---------- */
  var LEGAL_ORDRE = ["mentions", "cgv", "donnees", "registre"];
  var LEGAL = {};

  LEGAL.mentions = {
    onglet: "Mentions légales",
    numero: "01",
    titre: "Mentions légales",
    sous: "Qui vend, qui héberge, qui répond.",
    corps: `
<p class="legal-date">Maquette, à jour au 22 septembre 2026</p>
<div class="legal-alerte"><p>Cette page est une maquette. <b>HM CLIM est une société de travail, pas encore créée</b> : raison sociale, forme et capital sont à confirmer, et le SIRET, le RCS et le numéro de TVA seront attribués à l'immatriculation. Les autres éléments notés <b>à compléter</b> dépendent de contrats qui ne sont pas encore signés.</p></div>

<h3>Éditeur du site</h3>
<p><b>HM CLIM</b>, société par actions simplifiée au capital de 50 000 euros, en cours de création.<br>
SIRET, RCS et numéro de TVA intracommunautaire : attribués à l'immatriculation, <b>à compléter</b>.<br>
Siège social : 49 rue de Douai, 75009 Paris.<br>
Représentant légal : Hocine LOUIBA, président.</p>
<p>Téléphone : 01 84 80 22 10. Courriel : europe@maxipower.com.<br>
Directeur de la publication : Hocine LOUIBA.</p>

<h3>Marque et produits</h3>
<p>MaxiPower est une marque de climatiseurs. HM CLIM en assure la vente et la pose en France et en Europe. Les photographies, dessins techniques et textes de ce site ne peuvent être repris sans autorisation ; les caractéristiques des appareils sont celles communiquées par le fabricant et peuvent évoluer d'une série à l'autre.</p>

<h3>Hébergement</h3>
<p>Nom, adresse et téléphone de l'hébergeur : <b>à compléter</b> à la mise en ligne. Les données de commande sont hébergées dans l'Union européenne.</p>

<h3>Réclamation et médiation</h3>
<p>Toute réclamation s'adresse d'abord à nous, par courriel à europe@maxipower.com ou par courrier au siège. Si la réponse ne convient pas, un consommateur peut saisir gratuitement un médiateur de la consommation dans l'année qui suit sa réclamation écrite.</p>
<p>Médiateur désigné : <b>à compléter</b>. La désignation d'un médiateur agréé est obligatoire pour tout professionnel qui vend à des consommateurs, et ses coordonnées doivent figurer ici et dans les conditions générales de vente.</p>

<h3>Droit applicable</h3>
<p>Droit français. À défaut de solution amiable, les tribunaux français sont compétents. Un consommateur peut saisir la juridiction du lieu où il demeurait lors de la commande ou du lieu de livraison.</p>

<h3>Données personnelles</h3>
<p>Le détail des traitements figure dans la <a data-legal="donnees">politique de confidentialité</a> et dans le <a data-legal="registre">registre des traitements</a>.</p>
`
  };

  LEGAL.cgv = {
    onglet: "Conditions de vente",
    numero: "02",
    titre: "Conditions générales de vente",
    sous: "Particuliers et professionnels. Ce qui change est signalé à chaque article.",
    corps: `
<p class="legal-date">Maquette, en vigueur au 22 septembre 2026</p>

<h3>1. Objet et qui est concerné</h3>
<p>Ces conditions régissent la vente des climatiseurs MaxiPower, de leurs accessoires et des prestations de pose, par HM CLIM, à deux publics distincts :</p>
<ul>
<li>le <b>client particulier</b>, qui achète pour son usage privé. Il est consommateur au sens du code de la consommation et bénéficie de tout ce que ce code lui réserve, en particulier la rétractation et les garanties légales ;</li>
<li>le <b>client professionnel</b>, qui achète pour les besoins de son activité, après ouverture d'un compte. La vente relève alors des règles entre professionnels : pas de rétractation, sauf le cas de l'article 10, et des conditions de prix propres.</li>
</ul>
<p>Passer commande vaut acceptation des présentes. Elles sont accessibles à tout moment depuis le bas de chaque page et sont communiquées à tout professionnel qui en fait la demande.</p>

<h3>2. Le vendeur</h3>
<p>HM CLIM, SAS au capital de 50 000 euros, représentée par son président Hocine LOUIBA, siège 49 rue de Douai, 75009 Paris. SIRET, RCS et TVA intracommunautaire <b>à compléter</b> à l'immatriculation. Téléphone 01 84 80 22 10, courriel europe@maxipower.com. C'est nous qui répondons de la garantie légale de conformité, de la garantie des vices cachés, de la garantie commerciale et du service après-vente.</p>

<h3>3. Les appareils</h3>
<p>Chaque fiche produit indique la puissance frigorifique en BTU et en kilowatts, la surface conseillée, la classe énergétique, le fluide frigorigène, le niveau sonore et les dimensions. Les photographies et les dessins techniques sont donnés à titre d'illustration : une teinte, un bandeau de façade ou un accessoire peuvent varier d'une série à l'autre sans que la commande en soit modifiée.</p>
<p>La puissance conseillée par le calculateur du site est une estimation faite à partir de ce que vous saisissez. Elle ne remplace pas l'étude du poseur, qui reste seul juge de la faisabilité sur place.</p>

<h3>4. Prix</h3>
<p><b>Particuliers.</b> Les prix sont affichés en euros toutes taxes comprises, taxe sur la valeur ajoutée française de 20 % incluse. Les frais de livraison et, le cas échéant, le prix de la pose sont annoncés avant la validation de la commande et repris dans le récapitulatif.</p>
<p><b>Professionnels.</b> Les prix sont affichés hors taxes. La remise dépend du nombre d'unités commandées : 5 % à partir de trois unités, 10 % à partir de six, 15 % à partir de douze. Ces seuils sont fixes et s'appliquent à toute commande qui les atteint. Un devis chiffré en ligne est valable trente jours.</p>
<p>Les prix peuvent changer à tout moment ; le prix applicable est celui affiché au moment où la commande est validée, ou celui du devis tant qu'il est valable.</p>

<h3>5. Le compte professionnel</h3>
<p>L'évaluation des besoins et le chiffrage sont libres d'accès. Le devis détaillé n'apparaît qu'une fois le compte ouvert. L'ouverture demande le numéro SIRET, un extrait Kbis de moins de trois mois, l'identité du responsable et l'adresse de facturation. Nous vérifions ces éléments avant d'ouvrir l'accès et nous pouvons refuser une demande sans avoir à nous en expliquer.</p>
<p>Aucun relevé d'identité bancaire n'est demandé et aucun paiement à terme n'est proposé.</p>

<h3>6. La commande</h3>
<p>Le panier récapitule les articles, les quantités et le prix total. Vous pouvez le modifier jusqu'au dernier écran. La commande n'est ferme qu'après confirmation sur un bouton portant la mention <b>commande avec obligation de paiement</b>, et nous en accusons réception par courriel sans délai.</p>
<p>Pour toute commande d'un montant égal ou supérieur à 120 euros, nous conservons le contrat pendant dix ans et vous y donnons accès sur demande.</p>

<h3>7. Paiement</h3>
<p>Le paiement s'effectue à la commande, par carte bancaire ou par virement. Aucun frais n'est ajouté en raison du moyen de paiement choisi. Les coordonnées de carte sont saisies chez notre prestataire de paiement, qui seul les traite : nous ne les recevons pas et ne les conservons pas. Prestataire retenu : <b>à compléter</b>.</p>
<p><b>Entre professionnels</b>, tout retard de paiement fait courir de plein droit des pénalités au taux prévu par les conditions convenues, ainsi que l'indemnité forfaitaire de recouvrement de 40 euros prévue par l'article L. 441-10 du code de commerce. Les appareils restent notre propriété jusqu'au paiement complet du prix, le risque étant quant à lui transféré dans les conditions de l'article 8.</p>

<h3>8. Livraison</h3>
<p>La date ou le délai de livraison est indiqué avant la validation de la commande. À défaut d'indication, la livraison intervient au plus tard trente jours après la commande. En cas de retard, vous pouvez annuler la commande ; nous remboursons alors la totalité des sommes versées dans les quatorze jours, par le même moyen de paiement, sans vous imposer d'avoir.</p>
<p>La livraison se fait au pied de l'immeuble ou devant la maison, sur un créneau annoncé la veille. Vérifiez l'état de l'emballage à la réception et signalez toute avarie sur le bon du transporteur, puis à nous, le plus tôt possible : cela facilite le recours, même si cela ne conditionne aucun de vos droits.</p>
<p><b>Particuliers.</b> Le risque de perte ou d'endommagement vous est transféré au moment où vous prenez physiquement possession de l'appareil, et non à sa remise au transporteur. <b>Professionnels.</b> Le risque est transféré à la remise au transporteur.</p>

<h3>9. Pose et mise en service</h3>
<p>La pose est assurée par un frigoriste titulaire de l'attestation de capacité exigée pour manipuler les fluides frigorigènes. Elle comprend l'unité intérieure, le groupe extérieur et la liaison jusqu'à quatre mètres, la mise en service, le contrôle d'étanchéité et la signature du certificat. Au-delà de quatre mètres, le supplément est annoncé avant l'intervention ; si la configuration des lieux rend la pose impossible, nous vous le disons sur place et la prestation n'est pas facturée.</p>
<p>Vous devez avoir obtenu, avant l'intervention, les autorisations nécessaires à la pose du groupe extérieur : accord de la copropriété, déclaration préalable en mairie, avis de l'architecte des bâtiments de France en secteur protégé. L'outil <a data-aller="pose">Où poser le groupe</a> vous indique lesquelles vous concernent. Une intervention qui ne peut avoir lieu faute d'autorisation reste due.</p>
<p>N'ouvrez jamais le circuit frigorifique vous-même : c'est réservé à un professionnel certifié, et une intervention par un tiers non certifié met fin à la garantie commerciale.</p>

<h3>10. Rétractation</h3>
<h4>Vous êtes un particulier</h4>
<p>Vous disposez de <b>quatorze jours</b> pour vous rétracter, sans avoir à vous justifier. Le délai court à compter du lendemain de la réception de l'appareil ; s'il expire un samedi, un dimanche ou un jour férié, il est prolongé jusqu'au premier jour ouvrable suivant.</p>
<p>Pour l'exercer, il suffit de nous le dire clairement : par le formulaire de rétractation joint à la confirmation de commande, par la fonctionnalité de rétractation du site, par courriel ou par courrier. Nous vous en accusons réception sur un support durable, avec la date et l'heure.</p>
<p>Renvoyez l'appareil complet, dans son emballage, dans les quatorze jours qui suivent. Les frais de retour sont à notre charge. Nous remboursons la totalité des sommes versées, frais de livraison standard compris, dans les quatorze jours suivant la réception de votre décision, par le même moyen de paiement.</p>
<p><b>Ce qui met fin à la rétractation :</b> la pose et la mise en service. C'est une prestation de service que nous n'exécutons qu'avec votre accord exprès et votre renoncement exprès à la rétractation, recueillis avant l'intervention. Une fois l'appareil posé et mis en service, il n'est plus repris.</p>
<h4>Vous êtes un professionnel</h4>
<p>La rétractation ne s'applique pas. Une exception : le professionnel qui emploie <b>cinq salariés au plus</b> et qui commande hors établissement un bien ou un service n'entrant pas dans le champ de son activité principale en bénéficie, dans les mêmes conditions qu'un consommateur.</p>
<h4>Formulaire type de rétractation</h4>
<p>À compléter et à renvoyer seulement si vous souhaitez vous rétracter. Vous pouvez aussi le faire en ligne, <a data-aller="retractation">sur cette page</a> : nous vous adressons alors sans délai un accusé de réception sur un support durable, avec la date et l'heure.</p>
<div class="formule-type">À l'attention de HM CLIM, 49 rue de Douai, 75009 Paris, europe@maxipower.com.

Je vous notifie par la présente ma rétractation du contrat portant sur la vente du bien ci-dessous :

Bien commandé : .....................................................
Commandé le : ......................  Reçu le : ......................
Numéro de commande : ................................................
Nom du consommateur : ................................................
Adresse du consommateur : ............................................

Signature (seulement en cas de notification sur papier) :

Date : ......................</div>

<h3>11. Garanties légales</h3>
<div class="legal-cadre">
<h4>Garantie légale de conformité</h4>
<p>L'appareil doit être conforme à l'usage attendu et à la description que nous en faisons. Vous disposez de <b>deux ans à compter de la délivrance</b> pour agir. Pendant ces deux ans, sur un appareil neuf, le défaut est présumé exister au jour de la vente : vous n'avez rien à prouver, c'est à nous d'établir le contraire.</p>
<p>Vous choisissez entre la réparation et le remplacement ; nous ne pouvons imposer l'autre option qu'en cas de différence de coût manifeste. L'une ou l'autre intervient dans les trente jours de votre demande et ne vous coûte rien, ni déplacement, ni main-d'oeuvre, ni pièce. Une réparation prolonge la garantie de douze mois ; un remplacement que nous imposons alors que vous demandiez une réparation la fait repartir pour deux ans.</p>
<p>Si la réparation et le remplacement sont impossibles, ne peuvent intervenir dans le mois ou vous causent un inconvénient majeur, vous pouvez demander une réduction du prix ou la résolution de la vente. Le remboursement intervient au plus tard quatorze jours après que nous avons été informés de votre décision.</p>
<h4>Garantie légale des vices cachés</h4>
<p>Vous pouvez aussi agir au titre des vices cachés, c'est-à-dire d'un défaut non apparent à l'achat qui rend l'appareil inutilisable ou en diminue fortement l'usage. Le délai est de <b>deux ans à compter de la découverte du vice</b>, dans la limite de vingt ans après la vente. La preuve du vice vous incombe. Vous pouvez alors rendre l'appareil et être remboursé, ou le garder et obtenir une réduction du prix.</p>
<h4>Qui répond de ces garanties</h4>
<p>HM CLIM, 49 rue de Douai, 75009 Paris, 01 84 80 22 10, europe@maxipower.com. Ces garanties s'appliquent quelle que soit la garantie commerciale décrite ci-dessous, et sans frais pour vous.</p>
</div>
<p>Entre professionnels, la garantie des vices cachés s'applique dans les conditions du code civil.</p>

<h3>12. Garantie commerciale</h3>
<p>En plus des garanties légales, nous garantissons l'appareil <b>trois ans</b> et le compresseur <b>cinq ans</b>, à compter de la date de mise en service portée sur le certificat. Pièces, main-d'oeuvre et déplacement sont compris. Elle ne joue pas si le circuit a été ouvert par un tiers non certifié, si l'appareil a été posé hors des règles de l'art, ou en cas de dommage dû à un choc, à la foudre ou à un défaut d'alimentation électrique.</p>
<p>Cette garantie commerciale est facultative et ne remplace rien : elle s'ajoute aux garanties légales de l'article 11, qui restent dues même si elle est refusée.</p>

<h3>13. Fluide frigorigène et entretien</h3>
<p>Les appareils contiennent un fluide frigorigène fluoré dont la manipulation, la récupération et l'élimination sont réservées à des opérateurs certifiés. Les obligations de contrôle d'étanchéité et d'inspection périodique dépendent de la charge et de la puissance de l'installation ; celles qui concernent votre appareil vous sont indiquées sur le certificat de mise en service. L'entretien courant, lui, reste conseillé une fois par an et ne conditionne pas la garantie.</p>
<p>En fin de vie, l'appareil relève de la filière des déchets d'équipements électriques et électroniques. Nous reprenons l'ancien appareil lors de la pose du nouveau, sur demande formulée à la commande.</p>

<h3>14. Responsabilité et force majeure</h3>
<p>Nous répondons de la bonne exécution de la vente et de la pose. Nous ne répondons pas des conséquences d'une information inexacte que vous nous auriez donnée sur les lieux, ni d'un usage non conforme à la notice.</p>
<p>Aucune des parties ne répond d'un manquement dû à un cas de force majeure au sens de l'article 1218 du code civil. Entre professionnels, notre responsabilité est limitée au montant de la commande concernée ; cette limitation ne joue pas envers un particulier.</p>

<h3>15. Données personnelles</h3>
<p>Les traitements que la commande, la livraison, la pose et le compte professionnel impliquent sont décrits dans la <a data-legal="donnees">politique de confidentialité</a>, distincte des présentes.</p>

<h3>16. Réclamation, médiation, litiges</h3>
<p>Écrivez-nous d'abord : europe@maxipower.com, ou 49 rue de Douai, 75009 Paris. Si la réponse ne vous convient pas, et si vous êtes un consommateur, vous pouvez saisir gratuitement un médiateur de la consommation dans l'année qui suit votre réclamation écrite, à condition que le litige ne soit pas déjà devant un autre médiateur ou un tribunal. Médiateur désigné : <b>à compléter</b>. Le coût de la médiation est à notre charge. Rien ne vous oblige à passer par elle avant de saisir le juge.</p>
<p>La médiation de la consommation n'est pas ouverte aux litiges entre professionnels.</p>
<p>Droit français. À défaut d'accord, les tribunaux français sont compétents. Un consommateur peut saisir la juridiction de son domicile au moment de la commande ou celle du lieu de livraison.</p>
`
  };

  LEGAL.donnees = {
    onglet: "Données personnelles",
    numero: "03",
    titre: "Politique de confidentialité",
    sous: "Ce que nous collectons, pourquoi, combien de temps, et comment vous reprenez la main.",
    corps: `
<p class="legal-date">Maquette, à jour au 22 septembre 2026</p>
<p>Nous ne vendons aucune donnée et nous n'en tirons aucune publicité ciblée. Ce qui suit vaut pour le site, la commande, la pose, le service après-vente et le compte professionnel.</p>

<h3>Qui est responsable</h3>
<p>HM CLIM, SAS représentée par son président Hocine LOUIBA, 49 rue de Douai, 75009 Paris. Pour toute question ou pour exercer vos droits : europe@maxipower.com, ou 01 84 80 22 10. Aucun délégué à la protection des données n'est désigné, l'activité ne l'imposant pas.</p>

<h3>Ce que nous collectons</h3>
<h4>Chez un particulier</h4>
<ul>
<li>identité et coordonnées : nom, prénom, adresse de livraison et adresse de pose, courriel, téléphone ;</li>
<li>commande : numéro, articles, montants, date, historique des achats, facture ;</li>
<li>paiement : montant, date, statut et référence de la transaction. Le numéro de carte est saisi chez le prestataire de paiement, qui seul le traite ; nous ne le voyons pas ;</li>
<li>pose : type de logement, étage, présence d'un ascenseur, accès au balcon ou à la façade, longueur de liaison estimée, photographies de l'emplacement si vous nous en envoyez, créneau retenu ;</li>
<li>après-vente : description de la panne, dates d'intervention, pièces changées, certificat de mise en service.</li>
</ul>
<h4>Chez un professionnel</h4>
<ul>
<li>entreprise : raison sociale, forme juridique, SIRET, adresse du siège et des établissements, extrait Kbis, numéro de TVA ;</li>
<li>interlocuteur : nom, fonction, courriel professionnel, téléphone ;</li>
<li>évaluation des besoins : type d'activité, nombre et nature des espaces, surfaces, hauteur sous plafond, exposition, affluence attendue, amplitude horaire, contraintes de chantier ;</li>
<li>devis et commandes : chiffrage, remise appliquée, bons de commande, factures ;</li>
<li>chantier : adresses d'intervention, plages horaires autorisées, nom du contact sur place.</li>
</ul>
<h4>Dans tous les cas</h4>
<ul>
<li>ce que le navigateur conserve pour faire fonctionner le site : panier en cours, mode particulier ou professionnel, réponses déjà saisies dans les calculateurs ;</li>
<li>journaux techniques du serveur, nécessaires à la sécurité.</li>
</ul>
<p>Le calculateur de puissance et l'outil <a data-aller="pose">Où poser le groupe</a> fonctionnent dans votre navigateur : tant que vous ne nous envoyez rien, ce que vous y saisissez ne nous parvient pas.</p>

<h3>À quoi cela sert</h3>
<ul>
<li>enregistrer la commande, livrer, poser, mettre en service et facturer ;</li>
<li>ouvrir et vérifier un compte professionnel, établir un devis et le suivre ;</li>
<li>assurer le service après-vente et faire jouer les garanties ;</li>
<li>répondre à vos questions et gérer les réclamations ;</li>
<li>tenir la comptabilité et répondre aux obligations fiscales ;</li>
<li>protéger le site contre les accès non autorisés ;</li>
<li>vous envoyer nos nouveautés, seulement si vous l'avez demandé.</li>
</ul>

<h3>Sur quoi nous nous appuyons</h3>
<p><b>L'exécution du contrat</b> pour la commande, la livraison, la pose, le compte professionnel et le devis. <b>Une obligation légale</b> pour la facturation, la comptabilité et la traçabilité de l'intervention sur le circuit frigorifique. <b>Notre intérêt légitime</b> pour la sécurité du site et le suivi des réclamations. <b>Votre consentement</b> pour les nouveautés par courriel, que vous pouvez retirer à tout moment par le lien de désinscription.</p>

<h3>Qui les reçoit</h3>
<p>Nos équipes, et seulement celles qui en ont besoin. En dehors, nos sous-traitants agissent sur nos instructions et pour la seule exécution de leur mission :</p>
<ul>
<li>le transporteur, pour le nom, l'adresse et le téléphone nécessaires à la livraison ;</li>
<li>l'installateur intervenant chez vous, pour l'adresse, le créneau et les contraintes de pose ;</li>
<li>le prestataire de paiement, pour la transaction ;</li>
<li>l'hébergeur du site et de la base de données, dans l'Union européenne ;</li>
<li>notre expert-comptable, pour les pièces comptables.</li>
</ul>
<p>Identité exacte de ces prestataires : <b>à compléter</b> à la mise en ligne. Aucune donnée n'est cédée ni louée à un tiers. Aucun transfert hors de l'Union européenne n'est prévu ; si l'un devenait nécessaire, il serait encadré par des clauses contractuelles types et signalé ici.</p>

<h3>Combien de temps</h3>
<ul>
<li>commande, facture et pièces comptables : dix ans, au titre des obligations comptables ;</li>
<li>compte client et compte professionnel : le temps de la relation, puis trois ans à compter du dernier contact ;</li>
<li>devis sans suite et demande de rappel : trois ans à compter du dernier contact ;</li>
<li>certificat de mise en service et dossier de garantie : cinq ans après la mise en service, le temps de la garantie du compresseur ;</li>
<li>photographies d'emplacement que vous nous envoyez : jusqu'à la fin de la pose, puis effacées ;</li>
<li>journaux techniques : douze mois au plus ;</li>
<li>inscription aux nouveautés : jusqu'au retrait de votre consentement, puis trois ans.</li>
</ul>

<h3>Cookies et stockage local</h3>
<p>Le site ne pose aucun cookie publicitaire et n'embarque aucun traceur de tiers. Il utilise le stockage local de votre navigateur pour garder votre panier, votre mode d'affichage et vos réponses en cours : c'est strictement nécessaire au service que vous demandez, et cela ne réclame donc pas votre consentement préalable. Vous pouvez l'effacer à tout moment depuis les réglages de votre navigateur ; vous perdrez alors le panier en cours.</p>
<p>Si un outil de mesure d'audience ou un bouton de réseau social était ajouté, un bandeau vous demanderait votre accord avant tout dépôt, finalité par finalité, avec un refus aussi simple qu'un accord.</p>

<h3>Sécurité</h3>
<p>Échanges chiffrés en HTTPS, accès aux comptes protégés par mot de passe jamais conservé en clair, cloisonnement des comptes professionnels, accès interne limité aux personnes habilitées, sauvegardes régulières.</p>

<h3>Vos droits</h3>
<p>Vous pouvez demander l'accès à vos données, leur rectification, leur effacement, la limitation du traitement, vous y opposer, et recevoir dans un format lisible celles que vous nous avez fournies. Écrivez à europe@maxipower.com : nous répondons dans un délai d'un mois. Nous pouvons demander une preuve d'identité en cas de doute.</p>
<p>Certaines données ne peuvent pas être effacées tant qu'une obligation légale l'interdit, par exemple une facture. Nous le disons alors clairement plutôt que de laisser croire à un effacement.</p>
<p>Si la réponse ne vous satisfait pas, vous pouvez saisir la Commission nationale de l'informatique et des libertés, 3 place de Fontenoy, 75007 Paris, www.cnil.fr.</p>
`
  };

  LEGAL.registre = {
    onglet: "Registre RGPD",
    numero: "04",
    titre: "Registre des activités de traitement",
    sous: "Article 30 du règlement européen. Document interne, tenu à jour à chaque nouveauté qui touche des données.",
    corps: `
<p class="legal-date">Maquette, à jour au 22 septembre 2026</p>
<div class="legal-lignes" style="border:1.5px solid var(--ink); background:var(--surface); padding:4px 16px 12px; margin-bottom:22px">
  <div><span class="cle">Responsable</span><span class="val">HM CLIM, SAS, 49 rue de Douai, 75009 Paris</span></div>
  <div><span class="cle">Représentant légal</span><span class="val">Hocine LOUIBA, président</span></div>
  <div><span class="cle">Contact</span><span class="val">europe@maxipower.com, 01 84 80 22 10</span></div>
  <div><span class="cle">Délégué</span><span class="val">Non désigné, l'activité ne l'imposant pas</span></div>
  <div><span class="cle">Transferts hors UE</span><span class="val">Aucun. Hébergement des données dans l'Union européenne</span></div>
</div>

<details class="legal-fiche" open><summary>1. Commandes, livraisons et facturation des particuliers</summary>
<div class="legal-lignes">
  <div><span class="cle">Finalité</span><span class="val">Enregistrer la commande, livrer l'appareil, facturer, suivre le dossier client.</span></div>
  <div><span class="cle">Base légale</span><span class="val">Exécution du contrat, article 6.1.b ; obligation légale pour la facturation et la comptabilité, article 6.1.c.</span></div>
  <div><span class="cle">Personnes</span><span class="val">Clients particuliers.</span></div>
  <div><span class="cle">Données</span><span class="val">Nom, prénom, adresse de livraison, courriel, téléphone, contenu de la commande, montants, référence et statut de paiement, factures.</span></div>
  <div><span class="cle">Destinataires</span><span class="val">Personnel habilité ; transporteur ; prestataire de paiement ; hébergeur ; expert-comptable.</span></div>
  <div><span class="cle">Transferts</span><span class="val">Aucun hors Union européenne.</span></div>
  <div><span class="cle">Conservation</span><span class="val">Dix ans pour les pièces comptables ; compte client trois ans après le dernier contact.</span></div>
  <div><span class="cle">Sécurité</span><span class="val">HTTPS, mots de passe hachés, accès interne restreint, sauvegardes.</span></div>
</div></details>

<details class="legal-fiche"><summary>2. Comptes professionnels, évaluation des besoins et devis</summary>
<div class="legal-lignes">
  <div><span class="cle">Finalité</span><span class="val">Vérifier la qualité de professionnel, ouvrir le compte, chiffrer un devis à partir des besoins déclarés, suivre la relation commerciale.</span></div>
  <div><span class="cle">Base légale</span><span class="val">Mesures précontractuelles et exécution du contrat, article 6.1.b ; intérêt légitime pour le suivi commercial, article 6.1.f.</span></div>
  <div><span class="cle">Personnes</span><span class="val">Dirigeants et salariés interlocuteurs des entreprises clientes ou prospectes : hôtels, restaurants, bars, bureaux, autres activités.</span></div>
  <div><span class="cle">Données</span><span class="val">Raison sociale, SIRET, extrait Kbis, adresse, numéro de TVA, nom, fonction, courriel et téléphone de l'interlocuteur ; réponses à l'évaluation des besoins : nature et nombre d'espaces, surfaces, hauteur sous plafond, exposition, affluence, horaires, contraintes de chantier ; devis, remises, bons de commande.</span></div>
  <div><span class="cle">Destinataires</span><span class="val">Personnel habilité ; hébergeur ; installateur partenaire pour la seule partie chantier.</span></div>
  <div><span class="cle">Transferts</span><span class="val">Aucun hors Union européenne.</span></div>
  <div><span class="cle">Conservation</span><span class="val">Durée de la relation, puis trois ans après le dernier contact. Devis sans suite : trois ans. Kbis : le temps de la vérification, puis un an.</span></div>
  <div><span class="cle">Sécurité</span><span class="val">Cloisonnement des comptes, HTTPS, accès aux pièces d'identification réservé aux personnes habilitées.</span></div>
</div></details>

<details class="legal-fiche"><summary>3. Pose, mise en service et service après-vente</summary>
<div class="legal-lignes">
  <div><span class="cle">Finalité</span><span class="val">Organiser l'intervention, établir le certificat de mise en service, traiter les pannes et faire jouer les garanties.</span></div>
  <div><span class="cle">Base légale</span><span class="val">Exécution du contrat, article 6.1.b ; obligation légale liée à la traçabilité des interventions sur un circuit contenant un fluide frigorigène fluoré, article 6.1.c.</span></div>
  <div><span class="cle">Personnes</span><span class="val">Clients particuliers et professionnels ; contacts sur place désignés par le client.</span></div>
  <div><span class="cle">Données</span><span class="val">Adresse d'intervention, type de logement ou de local, étage, accès, longueur de liaison, photographies d'emplacement transmises par le client, créneau, nom du contact, description de la panne, pièces changées, certificat signé.</span></div>
  <div><span class="cle">Destinataires</span><span class="val">Personnel habilité ; installateur intervenant ; hébergeur.</span></div>
  <div><span class="cle">Transferts</span><span class="val">Aucun hors Union européenne.</span></div>
  <div><span class="cle">Conservation</span><span class="val">Cinq ans après la mise en service, durée de la garantie du compresseur. Photographies d'emplacement effacées à la fin de la pose.</span></div>
  <div><span class="cle">Sécurité</span><span class="val">Accès restreint, transmission à l'installateur limitée aux seules informations du chantier.</span></div>
</div></details>

<details class="legal-fiche"><summary>4. Demandes de renseignement, rappels et nouveautés</summary>
<div class="legal-lignes">
  <div><span class="cle">Finalité</span><span class="val">Répondre aux questions posées par les formulaires, rappeler un visiteur qui le demande, envoyer les nouveautés à ceux qui s'y sont inscrits.</span></div>
  <div><span class="cle">Base légale</span><span class="val">Mesures précontractuelles, article 6.1.b ; consentement pour l'envoi des nouveautés, article 6.1.a.</span></div>
  <div><span class="cle">Personnes</span><span class="val">Visiteurs particuliers et professionnels.</span></div>
  <div><span class="cle">Données</span><span class="val">Nom, courriel, téléphone, message, et pour un professionnel l'entreprise et l'activité. Horodatage du consentement pour les nouveautés.</span></div>
  <div><span class="cle">Destinataires</span><span class="val">Personnel habilité ; hébergeur ; prestataire d'envoi des courriels.</span></div>
  <div><span class="cle">Transferts</span><span class="val">Aucun hors Union européenne ; prestataire d'envoi établi dans l'Union.</span></div>
  <div><span class="cle">Conservation</span><span class="val">Trois ans à compter du dernier contact. Inscription aux nouveautés : jusqu'au retrait du consentement, puis trois ans.</span></div>
  <div><span class="cle">Sécurité</span><span class="val">Formulaires en écriture seule, lecture réservée aux personnes habilitées, lien de désinscription dans chaque envoi.</span></div>
</div></details>

<details class="legal-fiche"><summary>5. Sécurité du site et journaux techniques</summary>
<div class="legal-lignes">
  <div><span class="cle">Finalité</span><span class="val">Détecter les accès anormaux, empêcher la fraude à la commande, diagnostiquer les incidents.</span></div>
  <div><span class="cle">Base légale</span><span class="val">Intérêt légitime à protéger le service et les clients, article 6.1.f.</span></div>
  <div><span class="cle">Personnes</span><span class="val">Tout visiteur du site.</span></div>
  <div><span class="cle">Données</span><span class="val">Adresse IP, horodatage, page appelée, identifiant de session, tentatives de connexion échouées.</span></div>
  <div><span class="cle">Destinataires</span><span class="val">Administrateur du site ; hébergeur.</span></div>
  <div><span class="cle">Transferts</span><span class="val">Aucun hors Union européenne.</span></div>
  <div><span class="cle">Conservation</span><span class="val">Douze mois au plus.</span></div>
  <div><span class="cle">Sécurité</span><span class="val">Journaux en accès restreint, limitation des tentatives de connexion.</span></div>
</div></details>

<h3>Droits des personnes</h3>
<p>Accès, rectification, effacement, limitation, opposition et portabilité s'exercent auprès de europe@maxipower.com, avec réponse dans un délai d'un mois. Réclamation possible auprès de la Commission nationale de l'informatique et des libertés, www.cnil.fr.</p>
<p>Ce registre est un document interne. Il doit être mis à jour à chaque fonctionnalité nouvelle qui touche des données personnelles, et à chaque changement de prestataire.</p>
`
  };

  /* ---------- rétractation ---------- */
  function remettreRetractation(){
    $("#retract").hidden = false;
    $("#accuse-retract").hidden = true;
  }

  function confirmerRetractation(){
    var manque = null;
    ["r-numero", "r-recue", "r-nom", "r-mail"].forEach(function(id){
      var c = document.getElementById(id), ok = c.value.trim() !== "";
      if (ok && id === "r-mail") ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.value);
      c.classList.toggle("faux", !ok);
      if (!ok && !manque) manque = c;
    });
    if (manque) { manque.focus(); return dire("Il manque quelque chose dans ce champ."); }

    var d = new Date();
    var jour = d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    var heure = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    $("#r-reference").textContent = "RT-2026-" + String(Math.floor(1000 + Math.random() * 9000));
    $("#r-accuse").textContent = "Reçue le " + jour + " à " + heure + ", pour la commande " +
      $("#r-numero").value.trim() + ", au nom de " + $("#r-nom").value.trim() + ". " +
      "L'accusé de réception part à " + $("#r-mail").value.trim() + ". Une étiquette de retour prépayée suit dans le même courriel ; " +
      "le remboursement intervient au plus tard quatorze jours après cette date.";
    $("#retract").hidden = true;
    $("#accuse-retract").hidden = false;
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  var legalActif = "mentions";

  function dessinerLegal(){
    var d = LEGAL[legalActif] || LEGAL.mentions;
    $("#legal-menu").innerHTML = LEGAL_ORDRE.map(function(k){
      return '<button type="button" data-legal="' + k + '" class="' + (k === legalActif ? "actif" : "") + '">' +
             '<span>' + LEGAL[k].numero + '</span>' + LEGAL[k].onglet + '</button>';
    }).join("");
    $("#legal-titre").textContent = d.titre;
    $("#legal-sous").textContent = d.sous;
    $("#legal-fil").textContent = d.titre;
    $("#legal-corps").innerHTML = d.corps;
  }

  function ouvrirLegal(cle){
    if (LEGAL[cle]) legalActif = cle;
    aller("legal");
  }

  /* ---------- pupitre ---------- */
  function calcul(){
    var s = +$("#surface").value, besoin = s * 520;
    if ($("#soleil").checked) besoin *= 1.18;
    if ($("#hauteur").checked) besoin *= 1.12;
    if ($("#monde").checked) besoin *= 1.15;
    var palier = besoin <= 15000 ? 12000 : (besoin <= 21000 ? 18000 : 24000);
    etat.btuConseille = palier;
    $("#lecture-btu").textContent = mono(palier);
    $("#lecture-kw").textContent = (palier === 12000 ? "3,5" : palier === 18000 ? "5,2" : "7,0") + " kW";
    $("#lecture-surface").textContent = s + " m²";
    document.body.style.setProperty("--t", ((s - 8) / 52).toFixed(2));
    var c = [];
    if ($("#soleil").checked) c.push("plein soleil");
    if ($("#hauteur").checked) c.push("plafond haut");
    if ($("#monde").checked) c.push("pièce ouverte");
    $("#verdict-texte").innerHTML = "Pour " + s + " m²" + (c.length ? " avec " + c.join(", ") : " sans contrainte particulière") +
      ", il faut un <b>" + mono(palier) + " BTU</b>.";
  }

  var ACCUEIL = {
    part: {
      oeil: "MaxiPower, fabricant de climatiseurs",
      titre: 'Tout est fluide : <em>le circuit, la livraison, la pose.</em>',
      chapo: "Dix modèles tropicalisés, de 12 000 à 24 000 BTU, à partir de 449 &euro;. Ils rafraîchissent l'été, chauffent l'hiver et tiennent la canicule jusqu'à 54 &deg;C dehors. Livrés sous 48 heures, posés par un frigoriste certifié, garantis 3 ans et 5 ans sur le compresseur.",
      actions: '<button class="bouton fort grand" type="button" data-aller="catalogue">Voir les climatiseurs</button>' +
               '<button class="bouton grand clair" type="button" id="vers-pupitre">Calculer ma puissance</button>',
      faits: [["10", "Modèles au catalogue"], ["54 &deg;C", "Tenue en canicule"], ["48 h", "Expédition"], ["5 ans", "Garantie compresseur"]]
    },
    pro: {
      oeil: "Vente directe aux professionnels",
      titre: 'Un devis fluide, <em>un chantier sans fuite.</em>',
      chapo: "Prix hors taxes du fabricant, remise de 5 à 15 % selon le nombre d'unités, pose par nos installateurs partenaires en dehors de vos heures de service, un interlocuteur unique et un dépannage sous 48 heures. Le devis se chiffre en ligne, pièce par pièce.",
      actions: '<button class="bouton fort grand" type="button" data-aller="pro">Évaluer mes besoins</button>' +
               '<button class="bouton grand clair" type="button" data-aller="catalogue">Catalogue au prix HT</button>',
      faits: [["15 %", "Remise maximale"], ["120", "Installateurs partenaires"], ["48 h", "Dépannage prioritaire"], ["6 h", "Pose hors service"]]
    }
  };

  function majMode(){
    var c = ACCUEIL[etat.mode];
    $("#hero-oeil").textContent = c.oeil;
    $("#hero-titre").innerHTML = c.titre;
    $("#hero-chapo").innerHTML = c.chapo;
    $("#hero-actions").innerHTML = c.actions;
    $("#hero-faits").innerHTML = c.faits.map(function(f){
      return '<span class="fait"><b>' + f[0] + "</b><span>" + f[1] + "</span></span>";
    }).join("");
    var v = document.getElementById("vers-pupitre");
    if (v) v.addEventListener("click", function(){
      document.querySelector(".pupitre").scrollIntoView({ behavior: "smooth", block: "center" });
      $("#surface").focus({ preventScroll: true });
    });

    var pro = etat.mode === "pro";
    $("#bandeau-pro").hidden = !pro;
    $("#voir-modeles").textContent = pro ? "Évaluer plusieurs pièces" : "Voir les modèles";
    $("#titre-panier").textContent = pro ? "Votre demande de devis" : "Votre panier";
    $("#titre-commande").textContent = pro ? "Votre demande de devis" : "Votre commande";
    $("#sous-commande").textContent = pro
      ? "Vos coordonnées et le lieu de pose. Aucun paiement : un commercial vous rappelle avec le devis signé."
      : "Trois blocs, rien de plus. Le paiement n'est pas encaissé, c'est une maquette.";
    $("#bloc-reglement").hidden = pro;
    $("#mention-prix").textContent = pro
      ? "Prix indicatifs en euros, hors taxes."
      : "Prix indicatifs en euros, toutes taxes comprises.";
    majAcceptation();
  }

  function prixTexte(prix){
    return etat.mode === "pro" ? euros(ht(prix)) : euros(prix);
  }
  function prixNote(){
    return etat.mode === "pro" ? "HT, remise de volume en sus" : "TTC, livraison offerte";
  }

  function carte(p){
    var conseille = p.btu === etat.btuConseille;
    var drapeau = conseille ? '<span class="drapeau">Pour votre pièce</span>'
      : (p.tech === "accessoire" ? '<span class="drapeau calme">Accessoire</span>'
      : p.tech === "classe" ? '<span class="drapeau calme">Classe A</span>' : '<span class="drapeau chaud">Inverter</span>');
    var specs = p.btu
      ? '<div><span>Pièce</span><b>' + p.surf[0] + " à " + p.surf[1] + ' m&sup2;</b></div>' +
        '<div><span>Classe</span><b>' + p.classe + '</b></div>' +
        '<div><span>Bruit</span><b>' + p.db + ' dB</b></div>' +
        '<div><span>Conso</span><b>' + p.conso + ' kWh/an</b></div>'
      : '<div style="grid-column:1/-1; color:var(--ink-2)">' + p.texte + '</div>';
    return '<article class="article' + (conseille ? " conseillé" : "") + '">' +
      '<button class="visuel" type="button" data-etiquette="' + (p.btu ? "FIG. " + (p.btu / 1000) + "K · UNITÉ INTÉRIEURE" : "ACCESSOIRE") + '" data-produit="' + p.ref + '" aria-label="' + p.nom + '">' + visuel(p) + drapeau + '</button>' +
      '<div class="corps"><span class="reference">' + p.ref + (p.mot ? " &middot; " + p.mot : "") + '</span>' +
      '<h3><button type="button" data-produit="' + p.ref + '">' + p.nom + '</button></h3>' +
      (p.btu ? '<div class="btu"><strong>' + mono(p.btu) + '</strong> BTU/h &middot; ' + String(p.kw).replace(".", ",") + ' kW &middot; SEER ' + p.seer + '</div>' : "") +
      '<div class="specs">' + specs + '</div>' +
      '<div class="pied-article"><span class="prix">' + prixTexte(p.prix) + '<small>' + prixNote() + '</small></span>' +
      '<button class="bouton fort" type="button" data-produit="' + p.ref + '">Voir</button></div>' +
      (p.btu ? '<label class="comparer"><input type="checkbox" data-comparer="' + p.ref + '"' +
        (comparaison.indexOf(p.ref) >= 0 ? " checked" : "") + '> Comparer</label>' : "") +
      '</div></article>';
  }

  /* ---------- catalogue ---------- */
  function filtrer(){
    var f = etat.filtres, q = etat.q.trim().toLowerCase().replace(/\s/g, "");
    return TOUT.filter(function(p){
      if (f.btu.length && (!p.btu || f.btu.indexOf(String(p.btu)) < 0)) return false;
      if (f.tech.length && f.tech.indexOf(p.tech) < 0) return false;
      if (f.surface.length) {
        if (!p.surf) return false;
        var pris = f.surface.some(function(t){
          var b = t.split("-");
          return p.surf[0] <= +b[1] && p.surf[1] >= +b[0];
        });
        if (!pris) return false;
      }
      if (f.wifi && !p.wifi) return false;
      if (f.silence && !(p.db && p.db < 35)) return false;
      if (p.prix > f.prix) return false;
      if (q) {
        var texte = (p.nom + p.ref + (p.btu || "") + (p.mot || "") + (p.texte || "")).toLowerCase().replace(/\s/g, "");
        if (texte.indexOf(q) < 0) return false;
      }
      return true;
    });
  }

  function dessiner(){
    var liste = filtrer().slice();
    liste.sort(function(a, b){
      if (etat.tri === "prix-croissant") return a.prix - b.prix;
      if (etat.tri === "prix-decroissant") return b.prix - a.prix;
      if (etat.tri === "conso") return (a.conso || 9999) - (b.conso || 9999);
      if (etat.tri === "bruit") return (a.db || 99) - (b.db || 99);
      var ca = a.btu === etat.btuConseille ? 0 : (a.btu ? 1 : 2), cb = b.btu === etat.btuConseille ? 0 : (b.btu ? 1 : 2);
      return ca - cb || a.prix - b.prix;
    });
    $("#compteur").textContent = liste.length + (liste.length > 1 ? " références" : " référence");
    $("#grille").innerHTML = liste.length ? liste.map(carte).join("")
      : '<p class="vide">Rien avec ces critères. Enlevez un filtre ou montez le prix maximum.</p>';

    ["12000", "18000", "24000"].forEach(function(b){
      $('[data-nb="btu-' + b + '"]').textContent = GAMME.filter(function(p){ return String(p.btu) === b; }).length;
    });
    ["inverter", "classe", "accessoire"].forEach(function(t){
      $('[data-nb="tech-' + t + '"]').textContent = TOUT.filter(function(p){ return p.tech === t; }).length;
    });
  }

  /* ---------- fiche ---------- */
  function fiche(){
    var p = trouver(etat.produit);
    if (!p) return aller("catalogue");
    $("#fil-produit").textContent = p.nom;
    var table = p.btu
      ? '<tr><th>Puissance frigorifique</th><td>' + mono(p.btu) + ' BTU/h, ' + String(p.kw).replace(".", ",") + ' kW</td></tr>' +
        '<tr><th>Surface conseillée</th><td>' + p.surf[0] + ' à ' + p.surf[1] + ' m²</td></tr>' +
        '<tr><th>Classe énergétique froid</th><td>' + p.classe + '</td></tr>' +
        '<tr><th>SEER / SCOP</th><td>' + p.seer + ' / ' + p.scop + '</td></tr>' +
        '<tr><th>Consommation annuelle</th><td>' + p.conso + ' kWh</td></tr>' +
        '<tr><th>Fluide frigorigène</th><td>' + p.fluide + '</td></tr>' +
        '<tr><th>Niveau sonore intérieur</th><td>' + p.db + ' dB(A)</td></tr>' +
        '<tr><th>Unité intérieure</th><td>' + p.dim + '</td></tr>' +
        '<tr><th>Pilotage par téléphone</th><td>' + (p.wifi ? "oui" : "non") + '</td></tr>' +
        '<tr><th>Garantie commerciale</th><td>3 ans, compresseur 5 ans</td></tr>' +
        '<tr><th>Garanties légales</th><td>conformité 2 ans, vices cachés 2 ans</td></tr>'
      : '<tr><th>Référence</th><td>' + p.ref + '</td></tr>' +
        '<tr><th>Garantie commerciale</th><td>2 ans</td></tr>' +
        '<tr><th>Garanties légales</th><td>conformité 2 ans, vices cachés 2 ans</td></tr>';

    var atouts = p.btu
      ? '<li>Testé jusqu\'à 54 &deg;C dehors : il ne se met pas en sécurité au plus chaud de l\'après-midi.</li>' +
        '<li>Tient une pièce de ' + p.surf[0] + ' à ' + p.surf[1] + ' m², chauffage compris l\'hiver.</li>' +
        (p.wifi ? '<li>Application pour le lancer avant de rentrer, programmation à la semaine.</li>'
                : '<li>Télécommande fournie, programmation quotidienne.</li>')
      : '<li>Expedie avec l\'appareil, dans le même colis.</li><li>Monté par l\'installateur le jour de la pose.</li>';

    $("#fiche").innerHTML =
      '<div><div class="visuel" data-etiquette="FIG. 1 · UNITÉ INTÉRIEURE, FACE">' + visuel(p, "face") + '</div>' +
        (p.btu ? '<div class="planches">' +
          '<div class="visuel" data-etiquette="FIG. 2 · PROFIL">' + visuel(p, "profil") + '</div>' +
          '<div class="visuel" data-etiquette="FIG. 3 · GROUPE">' + visuel(p, "groupe") + '</div>' +
        '</div>' : "") +
        '<table class="table-specs">' + table + '</table></div>' +
      '<div><span class="reference">' + p.ref + '</span>' +
        '<h1>' + p.nom + '</h1>' +
        '<div class="note-ligne"><span class="etoiles">' + etoiles(p.note) + '</span> ' + String(p.note).replace(".", ",") + ' sur 5, ' + p.avis + ' avis</div>' +
        '<p class="resume">' + (p.texte ? p.texte : (p.tech === "inverter"
          ? "Compresseur à vitesse variable : il ralentit au lieu de s'arrêter, tient la température au demi-degré et consomme d'autant moins que la pièce est déjà fraîche."
          : "Compresseur en tout ou rien, le plus simple et le moins cher à l'achat. Il fait le travail, plus bruyamment, et il consomme plus à l'usage.")) + '</p>' +
        '<ul class="atouts">' + atouts + '</ul>' +
        '<div class="achat">' +
          '<div class="prix" style="font-size:30px">' + prixTexte(p.prix) +
            '<small>' + prixNote() + ', expédition sous 48 h. Ou 3 x ' + euros(Math.round(p.prix / 3)) + ' sans frais.</small></div>' +
          (p.btu ? '<label class="pose-option"><input type="checkbox" id="pose-fiche"><span><b>Ajouter la pose, ' + euros(POSE) + '</b>' +
            '<small>Frigoriste certifié, liaison jusqu\'à 4 m, mise en service et signature de la garantie.</small></span></label>' : "") +
          '<div class="ligne-achat">' +
            '<div class="quantite"><button type="button" id="q-moins" aria-label="Moins">&minus;</button><span id="q-valeur">1</span><button type="button" id="q-plus" aria-label="Plus">+</button></div>' +
            '<span class="prix mono" id="prix-fiche">' + euros(p.prix) + '</span>' +
            '<button class="bouton fort grand" type="button" id="ajouter" style="flex:1">Ajouter au panier</button>' +
          '</div>' +
          '<small style="color:var(--ink-3)">Retour accepté sous 14 jours si l\'appareil n\'est pas posé. ' +
            'Garantie légale de conformité de 2 ans et garantie des vices cachés, sans frais, en plus de notre garantie commerciale : ' +
            '<a data-legal="cgv" style="color:var(--ember); text-decoration:underline; cursor:pointer">le détail</a>.</small>' +
        '</div>' +
      '</div>';

    var q = 1;
    function maj(){
      var u = p.prix + ($("#pose-fiche") && $("#pose-fiche").checked ? POSE : 0);
      $("#q-valeur").textContent = q;
      $("#prix-fiche").textContent = euros(u * q);
    }
    $("#q-moins").addEventListener("click", function(){ if (q > 1) { q--; maj(); } });
    $("#q-plus").addEventListener("click", function(){ if (q < 9) { q++; maj(); } });
    if ($("#pose-fiche")) $("#pose-fiche").addEventListener("change", maj);
    $("#ajouter").addEventListener("click", function(){
      ajouter(p.ref, q, $("#pose-fiche") && $("#pose-fiche").checked);
      dire(p.nom + " ajoute au panier.");
    });

    var proches = TOUT.filter(function(x){ return x.ref !== p.ref && (p.btu ? x.btu === p.btu : x.tech === "accessoire"); });
    $("#proches").innerHTML = proches.slice(0, 3).map(carte).join("");
  }

  /* ---------- ecran professionnel ---------- */
  function dessinerMetiers(){
    $("#metiers").innerHTML = Object.keys(METIERS).map(function(c){
      var m = METIERS[c];
      return '<button class="metier" type="button" data-metier="' + c + '" aria-pressed="' + (etat.metier === c) + '">' +
        '<span class="pictogramme">' + PICTO[c] + '</span><b>' + m.nom + '</b><span>' + m.phrase + '</span></button>';
    }).join("");
  }

  var etape = 0;

  function choix(chemin, valeur, liste){
    return '<div class="choix">' + liste.map(function(o){
      return '<label><input type="radio" name="' + chemin.replace(".", "-") + '" data-radio="' + chemin + '" value="' + o[0] + '"' +
        (valeur === o[0] ? " checked" : "") + '> ' + o[1] + '</label>';
    }).join("") + '</div>';
  }

  function dessinerQuestionnaire(){
    var m = METIERS[etat.metier], e = ETAPES[etape], dedans = "";

    if (e.cle === "espaces") {
      dedans = '<div class="espaces">' + m.espaces.map(function(x){
        var r = reponses.espaces[x.id];
        return '<div class="espace' + (r.actif ? " actif" : "") + '">' +
          '<label class="espace-tete"><input type="checkbox" data-espace="' + x.id + '"' + (r.actif ? " checked" : "") + '> ' + x.nom +
          '<span class="cap">' + (x.etude ? "étude a part" : x.mode === "nb" ? "quantité et surface unitaire" : "surface") + '</span></label>' +
          '<div class="espace-champs">' +
            (x.mode === "nb" ? '<div class="champ-court"><label for="nb-' + x.id + '">Nombre</label>' +
              '<input id="nb-' + x.id + '" type="number" min="1" max="200" value="' + r.nb + '" data-champ-espace="' + x.id + '.nb"></div>' : "") +
            '<div class="champ-court"><label for="s-' + x.id + '">Surface' + (x.mode === "nb" ? " unitaire" : "") + ', m²</label>' +
              '<input id="s-' + x.id + '" type="number" min="4" max="2000" value="' + r.surface + '" data-champ-espace="' + x.id + '.surface"></div>' +
            '<div class="champ-court"><label for="h-' + x.id + '">Hauteur sous plafond</label>' +
              '<select id="h-' + x.id + '" data-champ-espace="' + x.id + '.hauteur">' +
              ['2,5', '3', '3,5'].map(function(h){ return '<option' + (r.hauteur === h ? " selected" : "") + '>' + h + '</option>'; }).join("") +
              '</select></div>' +
          '</div></div>';
      }).join("") + '</div>';

    } else if (e.cle === "public") {
      var p = reponses.public;
      dedans =
        '<div class="groupe-q"><p class="q">Combien de personnes au maximum, en même temps</p>' +
          '<div class="champ-court" style="max-width:200px"><input type="number" min="0" max="800" value="' + p.affluence +
          '" data-champ="public.affluence"></div>' +
          '<div class="aide-champ">Couverts d\'un service complet, lits occupés, postes occupés. Chaque personne compte pour 350 BTU par heure.</div></div>' +
        '<div class="groupe-q"><p class="q">Quand l\'établissement tourne</p>' +
          choix("public.amplitude", p.amplitude, [["service", "Aux services, midi et soir"], ["journee", "En journée continue"], ["nuit", "Surtout la nuit"], ["continu", "24 heures sur 24"]]) + '</div>' +
        '<div class="groupe-q"><p class="q">Jours d\'ouverture par semaine</p>' +
          choix("public.jours", p.jours, [["5", "5"], ["6", "6"], ["7", "7"]]) + '</div>' +
        '<div class="groupe-q"><p class="q">Saison</p>' +
          choix("public.saison", p.saison, [["ete", "Surtout l\'été"], ["annee", "Toute l\'année, chaud et froid"]]) + '</div>';

    } else if (e.cle === "bati") {
      var b = reponses.bati;
      dedans =
        '<div class="groupe-q"><p class="q">Âge du bâtiment</p>' +
          choix("bati.annee", b.annee, [["avant1975", "Avant 1975"], ["1975", "1975 a 2000"], ["2000", "2000 a 2015"], ["neuf", "Récent ou rénové"]]) + '</div>' +
        '<div class="groupe-q"><p class="q">Isolation des murs et de la toiture</p>' +
          choix("bati.isolation", b.isolation, [["mauvaise", "Mauvaise ou inconnue"], ["moyenne", "Moyenne"], ["bonne", "Bonne"]]) + '</div>' +
        '<div class="groupe-q"><p class="q">Vitrage</p>' +
          choix("bati.vitrage", b.vitrage, [["simple", "Simple"], ["double", "Double"], ["triple", "Triple"]]) + '</div>' +
        '<div class="groupe-q"><p class="q">Part de surface vitrée</p>' +
          choix("bati.vitre", b.vitre, [["faible", "Faible"], ["moyenne", "Moyenne"], ["importante", "Baies ou vitrine"]]) + '</div>' +
        '<div class="groupe-q"><p class="q">Exposition dominante</p>' +
          choix("bati.exposition", b.exposition, [["nord", "Nord"], ["est", "Est"], ["sud", "Sud"], ["ouest", "Ouest"]]) + '</div>' +
        '<div class="groupe-q"><p class="q">Dernier étage, sous toiture</p>' +
          choix("bati.dernier", b.dernier, [["non", "Non"], ["oui", "Oui"]]) + '</div>';

    } else if (e.cle === "apports") {
      var a = reponses.apports;
      dedans = '<div class="espaces">' + [
        ["cuisine", "Cuisine ouverte sur la salle", "Le piano et les fours envoient leur chaleur dans la salle."],
        ["vitrines", "Vitrines ou meubles réfrigérés", "Un meuble positif rejette sa chaleur dans la pièce."],
        ["eclairage", "Éclairage halogène ou scénique", "Les projecteurs chauffent autant qu'un radiateur."],
        ["ecrans", "Beaucoup d'écrans et d'ordinateurs", "Huit postes valent un petit radiateur allume toute la journée."],
        ["machines", "Machines, serveurs, matériel en marche continue", "Ils imposent une machine dédiée qui ne s'arrête pas."]
      ].map(function(o){
        return '<label class="espace' + (a[o[0]] ? " actif" : "") + '" style="cursor:pointer">' +
          '<span class="espace-tete"><input type="checkbox" data-apport="' + o[0] + '"' + (a[o[0]] ? " checked" : "") + '> ' + o[1] + '</span>' +
          '<span class="synthese-espace">' + o[2] + '</span></label>';
      }).join("") + '</div>';

    } else if (e.cle === "chantier") {
      var c = reponses.chantier;
      dedans =
        '<div class="groupe-q"><p class="q">Où se pose le groupe extérieur</p>' +
          choix("chantier.groupe", c.groupe, [["cour", "Cour ou jardin"], ["facade", "Facade"], ["toiture", "Toiture ou terrasse"], ["balcon", "Balcon"]]) + '</div>' +
        '<div class="groupe-q"><p class="q">Distance entre l\'unité intérieure et le groupe, en mètres</p>' +
          '<div class="champ-court" style="max-width:160px"><input type="number" min="1" max="40" value="' + c.liaison + '" data-champ="chantier.liaison"></div>' +
          '<div class="aide-champ">Quatre mètres sont compris dans la pose. Au-delà, 45 euros le mètre.</div></div>' +
        '<div class="groupe-q"><p class="q">Accès en hauteur, nacelle ou échafaudage</p>' +
          choix("chantier.nacelle", c.nacelle, [["non", "Non"], ["oui", "Oui"]]) + '</div>' +
        '<div class="groupe-q"><p class="q">Autorisation à obtenir, copropriété ou bâtiments de France</p>' +
          choix("chantier.autorisation", c.autorisation, [["non", "Non"], ["oui", "Oui"], ["sais", "A vérifier"]]) + '</div>' +
        '<div class="groupe-q"><p class="q">Voisinage sensible au bruit</p>' +
          choix("chantier.bruit", c.bruit, [["non", "Non"], ["oui", "Oui"]]) + '</div>' +
        '<div class="groupe-q"><p class="q">Alimentation électrique disponible</p>' +
          choix("chantier.elec", c.elec, [["mono", "Monophase"], ["tri", "Triphase"], ["sais", "A vérifier"]]) + '</div>' +
        '<div class="groupe-q"><p class="q">Matériel existant à déposer</p>' +
          choix("chantier.depose", c.depose, [["non", "Non"], ["oui", "Oui"]]) + '</div>' +
        '<div class="groupe-q"><p class="q">Le site reste ouvert pendant les travaux</p>' +
          choix("chantier.occupe", c.occupe, [["oui", "Oui, pose hors service"], ["non", "Non, site fermé"]]) + '</div>' +
        '<div class="groupe-q"><p class="q">Délai souhaité</p>' +
          choix("chantier.delai", c.delai, [["urgent", "Sous quinze jours"], ["mois", "Dans le mois"], ["saison", "Avant la saison"]]) + '</div>';

    } else {
      var e2 = etude();
      dedans = e2.lignes.length
        ? '<table class="recap-espaces"><tr><th>Espace</th><th>Surface</th><th>Besoin</th><th>Matériel</th></tr>' +
          e2.lignes.map(function(l){
            return '<tr><td><b>' + l.nom + '</b>' + (l.quantite > 1 ? ' <span class="synthese-espace">x ' + l.quantite + '</span>' : "") +
              (l.silence ? '<span class="pastille-etude" style="background:var(--glacier-voile); color:var(--glacier-fort)">silence</span>' : "") +
              (l.continu ? '<span class="pastille-etude">continu</span>' : "") + '</td>' +
              '<td class="n">' + l.surface + ' m²</td>' +
              '<td class="n">' + mono(l.besoin) + ' BTU</td>' +
              '<td class="n">' + l.unites + ' x ' + trouver(l.ref).nom + '</td></tr>';
          }).join("") + '</table>'
        : '<p style="color:var(--ink-3)">Aucun espace coche. Revenez à la première etape.</p>';
      if (!societe) dedans += '<div class="verrou"><b>Le chiffrage est prêt</b>' +
        '<p>' + e2.unites + (e2.unites > 1 ? " unités" : " unité") + ' à poser. Ouvrez votre compte professionnel pour afficher le prix, la remise et le détail du chantier.</p>' +
        '<button class="bouton fort" type="button" id="voir-devis">Voir le devis</button></div>';
      dedans += e2.alertes.length
        ? '<div class="vigilance"><b>Ce qui sera vérifie en visite</b><ul>' + e2.alertes.map(function(a){ return "<li>" + a + "</li>"; }).join("") + '</ul></div>'
        : "";
    }

    $("#config").innerHTML =
      '<div class="parcours">' +
        '<div class="parcours-tete"><span>Étape ' + (etape + 1) + ' sur ' + ETAPES.length + '</span>' +
        '<span>' + Math.round((etape + 1) / ETAPES.length * 100) + ' %</span></div>' +
        '<div class="jauge"><i style="width:' + Math.round((etape + 1) / ETAPES.length * 100) + '%"></i></div>' +
        '<div class="points">' + ETAPES.map(function(x, i){
          return '<button class="point-etape" type="button" data-etape="' + i + '" title="' + x.titre + '" aria-label="' + x.titre + '"' +
            ' data-etat="' + (i === etape ? "ici" : (i < etape ? "faite" : "avenir")) + '">' + (i + 1) + '</button>';
        }).join("") + '</div>' +
      '</div>' +
      '<div class="etape"><h3>' + e.titre + '</h3><p class="sous">' + e.sous + '</p>' + dedans + '</div>' +
      '<div class="navigation">' +
        (etape > 0 ? '<button class="bouton" type="button" data-pas="-1">Précédent</button>' : "") +
        (etape < ETAPES.length - 1
          ? '<button class="bouton fort" type="button" data-pas="1">Suivant</button>'
          : (societe
            ? '<button class="bouton fort" type="button" id="envoyer-devis">Recevoir ce devis</button>'
            : '<button class="bouton fort" type="button" id="voir-devis">Voir le devis chiffré</button>')) +
      '</div>';
  }

  function dessinerDevis(){
    var e = etude();

    if (!societe) {
      $("#devis").innerHTML =
        '<h3>Votre estimation <span>' + e.unites + (e.unites > 1 ? " unités" : " unité") + '</span></h3>' +
        (e.unites ? '<table>' + e.lignes.map(function(l){
          var p = trouver(l.ref);
          return '<tr><td class="q">' + l.unites + '</td><td><b>' + p.nom + '</b><br><span style="color:var(--ink-3); font-size:12.5px">' +
            l.nom.toLowerCase() + ", " + mono(l.besoin) + ' BTU nécessaires</span></td><td class="p masque">000 &euro;</td></tr>';
        }).join("") + '</table>'
          : '<p style="color:var(--ink-3)">Cochez au moins un espace à la première etape.</p>') +
        '<div class="verrou">' +
          '<span class="cadenas"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></span>' +
          '<b>Le prix s\'affiche avec votre compte</b>' +
          '<p>Matériel, remise de volume, pose et suppléments de chantier : tout est calculé, il ne reste qu\'à ouvrir le compte pour l\'afficher et garder le devis.</p>' +
          '<button class="bouton fort" type="button" id="voir-devis" style="width:100%">Voir le devis</button>' +
        '</div>' +
        (e.alertes.length ? '<div class="vigilance"><b>' + e.alertes.length + ' point' + (e.alertes.length > 1 ? "s" : "") + ' à confirmer en visite</b><ul>' +
          e.alertes.slice(0, 3).map(function(a){ return "<li>" + a + "</li>"; }).join("") + '</ul></div>' : "");
      return;
    }

    $("#devis").innerHTML =
      '<h3>Votre devis <span>DV-2026-' + (1000 + e.unites * 7) + '</span></h3>' +
      (e.unites ? '<table>' + e.lignes.map(function(l){
        var p = trouver(l.ref);
        return '<tr><td class="q">' + l.unites + '</td><td><b>' + p.nom + '</b><br><span style="color:var(--ink-3); font-size:12.5px">' +
          l.nom.toLowerCase() + ", " + mono(l.besoin) + ' BTU nécessaires</span></td>' +
          '<td class="p">' + euros(ht(p.prix) * l.unites) + '</td></tr>';
      }).join("") + '</table>'
        : '<p style="color:var(--ink-3)">Cochez au moins un espace à la première etape.</p>') +
      '<div class="zone-total">' +
        '<div class="l"><span>Matériel, ' + e.unites + (e.unites > 1 ? " unités" : " unité") + '</span><b>' + euros(e.materiel) + '</b></div>' +
        (e.taux ? '<div class="l remise"><span>Remise de volume, ' + Math.round(e.taux * 100) + ' %</span><b>-' + euros(Math.round(e.materiel * e.taux)) + '</b></div>' : "") +
        '<div class="l"><span>Pose, ' + euros(POSE_PRO) + ' par unité</span><b>' + euros(e.pose) + '</b></div>' +
        e.extras.map(function(x){ return '<div class="l"><span>' + x.nom + '</span><b>' + euros(x.prix) + '</b></div>'; }).join("") +
        '<div class="l"><span>Livraison</span><b>offerte</b></div>' +
        '<div class="tot"><span>Total HT</span><b>' + euros(e.totalHT) + '</b></div>' +
        '<div class="l"><span>TVA 20 %</span><b>' + euros(Math.round(e.totalHT * 0.2)) + '</b></div>' +
        '<div class="l"><span>Total TTC</span><b>' + euros(Math.round(e.totalHT * 1.2)) + '</b></div>' +
      '</div>' +
      '<div class="paliers">' + ["3 unités, 5 %", "6 unités, 10 %", "10 unités, 15 %"].map(function(t, i){
        return '<span class="palier' + (e.unites >= [3, 6, 10][i] ? " atteint" : "") + '">' + t + '</span>';
      }).join("") + '</div>' +
      (e.alertes.length ? '<div class="vigilance"><b>' + e.alertes.length + ' point' + (e.alertes.length > 1 ? "s" : "") + ' à confirmer en visite</b><ul>' +
        e.alertes.slice(0, 3).map(function(a){ return "<li>" + a + "</li>"; }).join("") + '</ul></div>' : "") +
      '<div class="mention">Chiffrage établi pour ' + (societe ? societe.raison + ", compte " + societe.numero : "votre société") +
      '. Maquette : rien n\'est transmis.</div>';
  }

  function dessinerPro(){
    if (!reponses) reponses = reponsesNeuves(etat.metier);
    $("#pro-compte").hidden = !!societe || !etat.demandeDevis;
    var b = $("#bandeau-compte");
    b.hidden = !societe;
    if (societe) {
      b.innerHTML = '<span>Compte <b>' + societe.numero + '</b>, ' + societe.raison + ', en cours de validation. Le devis est affiche, la remise s\'applique des l\'accord, sous 24 heures ouvrées.</span>' +
        '<button class="bouton" type="button" id="fermer-compte">Changer de société</button>';
    }
    dessinerMetiers();
    dessinerQuestionnaire();
    dessinerDevis();
  }

  function demanderCompte(){
    etat.demandeDevis = true;
    $("#pro-compte").hidden = false;
    $("#pro-compte").scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("raison").focus({ preventScroll: true });
  }

  function ouvrirCompte(){
    var manque = null;
    function verifier(id, test){
      var c = document.getElementById(id), ok = test ? test(c.value) : c.value.trim() !== "";
      c.classList.toggle("faux", !ok);
      if (!ok && !manque) manque = c;
      return ok;
    }
    verifier("raison");
    var siretOk = verifier("siret", siretValide);
    $("#aide-siret").textContent = siretOk ? "Clé de contrôle valide." : "Quatorze chiffres, clé de contrôle refusée. Vérifiez la saisie.";
    $("#aide-siret").classList.toggle("faux", !siretOk);
    verifier("siege");
    verifier("cp-pro", function(v){ return /^[0-9]{5}$/.test(v.trim()); });
    verifier("ville-pro");
    verifier("contact");
    verifier("mail-pro", function(v){ return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v); });
    verifier("tel-pro");

    if (!$("#kbis").files.length) {
      $("#depot-kbis").classList.add("faux");
      if (!manque) manque = $("#depot-kbis");
      dire("L'extrait Kbis est obligatoire pour ouvrir le compte.");
    }
    if (!$("#conditions").checked) {
      if (!manque) manque = $("#conditions");
      dire("Il faut accepter les conditions de vente professionnelles.");
    }
    if (manque) { manque.focus(); if (manque.id !== "conditions" && manque.id !== "depot-kbis") dire("Il manque quelque chose dans ce champ."); return; }

    societe = {
      numero: "PRO-2026-" + String(Math.floor(1000 + Math.random() * 9000)),
      raison: $("#raison").value.trim(),
      siret: $("#siret").value.replace(/\D/g, ""),
      secteur: $("#secteur").value,
      contact: $("#contact").value.trim(),
      mail: $("#mail-pro").value.trim()
    };
    ecrireSociete();
    majJetonSociete();
    etape = ETAPES.length - 1;
    dessinerPro();
    dire("Compte " + societe.numero + " ouvert. Voici votre devis chiffré.");
    $("#pro-travail").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function majJetonSociete(){
    var j = $("#jeton-societe");
    if (!j) return;
    j.hidden = !societe;
    if (societe) j.querySelector(".nom").textContent = societe.raison;
  }

  /* ---------- où poser le groupe extérieur ----------
     Règles tirées des fiches service-public.gouv.fr lues le 13 septembre 2026 :
     F36778 (autorisation d'urbanisme pour un climatiseur), F17578 (aspect
     extérieur), F31513 (travaux en copropriété), F612 (bruits de voisinage). */
  var lieu = { bien: "maison", emplacement: "facade", visible: "oui", protege: "sais", dalle: "non", voisin: "non" };

  var QUESTIONS_POSE = [
    { id: "bien", q: "Vous habitez", choix: [["maison", "Une maison individuelle"], ["appartement", "Un appartement en copropriété"]] },
    { id: "emplacement", q: "Le groupe extérieur irait", choix: [["facade", "En façade, fixé au mur"], ["balcon", "Sur un balcon ou une terrasse"], ["toiture", "En toiture"], ["sol", "Au sol, contre la maison"], ["jardin", "Au fond du jardin ou de la cour"]] },
    { id: "visible", q: "Se verrait-il depuis la rue ou depuis les fenêtres des voisins", choix: [["oui", "Oui"], ["non", "Non"], ["sais", "Je ne sais pas"]] },
    { id: "protege", q: "Êtes-vous en secteur protégé : abords d'un monument historique, site patrimonial remarquable, site classé ou inscrit", choix: [["non", "Non"], ["oui", "Oui"], ["sais", "À vérifier en mairie"]] },
    { id: "dalle", q: "Faut-il couler une dalle ou un socle pour poser le groupe", choix: [["non", "Non"], ["oui", "Oui"]] },
    { id: "voisin", q: "Le groupe serait à moins de cinq mètres d'une fenêtre ou d'une terrasse du voisin", choix: [["non", "Non"], ["oui", "Oui"]] }
  ];

  function dessinerQuestionsPose(){
    $("#questions-pose").innerHTML = QUESTIONS_POSE.map(function(q){
      return '<div class="groupe-q"><p class="q">' + q.q + '</p><div class="choix">' +
        q.choix.map(function(o){
          return '<label><input type="radio" name="lieu-' + q.id + '" data-lieu="' + q.id + '" value="' + o[0] + '"' +
            (lieu[q.id] === o[0] ? " checked" : "") + '> ' + o[1] + '</label>';
        }).join("") + '</div></div>';
    }).join("");
  }

  function lettreSyndic(){
    return "Madame, Monsieur le syndic,\n\n" +
      "Copropriétaire du lot situé [adresse, étage, numéro de lot], je souhaite faire installer un climatiseur réversible " +
      "dont l'unité extérieure serait posée [emplacement précis]. L'unité mesure [dimensions] et son niveau sonore " +
      "annoncé est de [xx] dB(A).\n\n" +
      "Ces travaux touchant à l'aspect extérieur de l'immeuble, je vous demande d'inscrire à l'ordre du jour de la " +
      "prochaine assemblée générale la résolution suivante : autorisation de faire poser, à mes frais exclusifs, " +
      "une unité extérieure de climatisation [emplacement], selon le descriptif et les documents joints.\n\n" +
      "Je joins la nature des travaux, leur emplacement, leur durée prévisible et les caractéristiques de " +
      "l'équipement, ainsi qu'un visuel d'insertion.\n\n" +
      "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n" +
      "[Nom, prénom, date, signature]";
  }

  function dessinerReponsePose(){
    var modifieAspect = ["facade", "balcon", "toiture"].indexOf(lieu.emplacement) >= 0 ||
      (lieu.visible === "oui" || lieu.visible === "sais");
    var protege = lieu.protege === "oui";
    var douteProtege = lieu.protege === "sais";
    var copro = lieu.bien === "appartement";
    var partieCommune = copro && ["facade", "toiture"].indexOf(lieu.emplacement) >= 0;
    var d = [];

    if (modifieAspect || (protege && lieu.dalle === "oui")) {
      d.push({ classe: "obligatoire", titre: "Déclaration préalable en mairie",
        delai: protege ? "Instruction 2 mois" : "Instruction 1 mois",
        texte: "Poser une unité extérieure visible modifie l'aspect extérieur de la construction : une déclaration préalable de travaux doit être déposée en mairie, en ligne ou au guichet, et acceptée avant le début des travaux." +
          (protege ? " En secteur protégé, le délai d'instruction passe à deux mois et l'architecte des bâtiments de France donne son avis." : ""),
        source: "service-public.gouv.fr, fiches F36778 et F17578, qui renvoient aux articles R. 421-11, R. 421-13 et R. 421-17 du code de l'urbanisme, et R. 423-23 pour le délai." });
    } else {
      d.push({ classe: "libre", titre: "Pas de formalité d'urbanisme a priori",
        delai: "Rien à déposer",
        texte: "Une unité posée au sol, non visible depuis l'espace public ni des immeubles voisins, et sans modification de l'aspect extérieur, est dispensée de formalité. Attention : en secteur protégé, la seule construction d'une dalle suffit à rendre la déclaration obligatoire.",
        source: "service-public.gouv.fr, fiche F36778." });
    }

    if (douteProtege) {
      d.push({ classe: "vigilance", titre: "Vérifier si vous êtes en secteur protégé",
        delai: "Un appel à la mairie",
        texte: "Abords d'un monument historique, site patrimonial remarquable, site classé ou inscrit, réserve naturelle : dans ces périmètres, les règles se durcissent et l'architecte des bâtiments de France intervient. Le service urbanisme de votre commune vous le dit en deux minutes.",
        source: "service-public.gouv.fr, fiche F36778." });
    }

    if (copro) {
      d.push({ classe: "obligatoire", titre: "Autorisation de l'assemblée générale",
        delai: partieCommune ? "À inscrire à l'ordre du jour" : "Avant tout début de travaux",
        texte: "Les travaux qui touchent à l'aspect extérieur de l'immeuble ou aux parties communes, dont la pose d'un climatiseur, doivent être autorisés par l'assemblée générale à la majorité absolue, dite majorité de l'article 25. " +
          (partieCommune ? "Si la pose revient à s'approprier une partie commune, c'est la double majorité de l'article 26 qui s'applique. " : "") +
          "La demande se fait auprès du syndic par lettre recommandée avec accusé de réception, avec la nature des travaux, leur emplacement, leur durée et les caractéristiques de l'équipement. Sans cette autorisation, le syndicat des copropriétaires peut exiger l'arrêt des travaux et la démolition de ce qui a été posé.",
        source: "service-public.gouv.fr, fiche F31513, loi n° 65-557 du 10 juillet 1965, articles 25 et 26.",
        lettre: true });
    }

    d.push({ classe: "vigilance", titre: "Le plan local d'urbanisme de votre commune",
      delai: "À consulter avant d'acheter",
      texte: "Le PLU peut interdire les unités visibles depuis la voie publique, imposer un habillage, une hauteur ou un retrait. Il prime sur la règle générale et varie d'une commune à l'autre.",
      source: "service-public.gouv.fr, fiche F36778." });

    d.push({ classe: lieu.voisin === "oui" ? "obligatoire" : "vigilance", titre: "Le bruit chez le voisin",
      delai: lieu.voisin === "oui" ? "À traiter dès la pose" : "À garder en tête",
      texte: "L'installation ne doit pas causer de trouble anormal de voisinage : on regarde l'intensité du bruit, sa durée et sa répétition, et le contexte du quartier. Entre 22 heures et 7 heures, le tapage nocturne s'ajoute à cette règle. " +
        (lieu.voisin === "oui" ? "À moins de cinq mètres d'une fenêtre voisine, prévoyez des plots antivibratiles, un écran acoustique, et un modèle silencieux : nos Inverter Smart descendent à 31 dB(A) en vitesse basse." : ""),
      source: "service-public.gouv.fr, fiche F612, code de la santé publique, article R. 1336-5." });

    var obligatoires = d.filter(function(x){ return x.classe === "obligatoire"; }).length;
    $("#reponse-pose").innerHTML =
      '<h3>Vos démarches <span>' + obligatoires + (obligatoires > 1 ? " obligatoires" : " obligatoire") + '</span></h3>' +
      d.map(function(x){
        return '<div class="demarche ' + x.classe + '"><span class="delai">' + x.delai + '</span>' +
          '<h4>' + x.titre + '</h4><p>' + x.texte + '</p>' +
          (x.lettre ? '<details><summary style="cursor:pointer; font-size:13px; font-weight:700">Modèle de demande au syndic</summary>' +
            '<div class="modele-lettre">' + lettreSyndic() + '</div></details>' : "") +
          '<div class="source">' + x.source + '</div></div>';
      }).join("") +
      '<div class="mention">Aide au repérage, pas un avis juridique. La mairie et le syndic tranchent.</div>';
  }

  function dessinerPose(){
    dessinerQuestionsPose();
    dessinerReponsePose();
  }

  /* ---------- comparateur ---------- */
  function majComparateur(){
    $("#barre-comparer").classList.toggle("visible", comparaison.length > 0);
    $("#texte-comparer").textContent = comparaison.length +
      (comparaison.length > 1 ? " modèles sélectionnés" : " modèle sélectionné") +
      (comparaison.length < 2 ? ", ajoutez-en un autre" : "");
    $("#ouvrir-comparateur").disabled = comparaison.length < 2;
  }

  function ouvrirComparateur(){
    var liste = comparaison.map(trouver);
    var lignes = [
      ["Puissance", function(p){ return mono(p.btu) + " BTU/h"; }],
      ["Puissance en kW", function(p){ return String(p.kw).replace(".", ",") + " kW"; }],
      ["Surface conseillée", function(p){ return p.surf[0] + " à " + p.surf[1] + " m²"; }],
      ["Technologie", function(p){ return p.tech === "inverter" ? "Inverter" : "Classe A, tout ou rien"; }],
      ["Classe énergétique", function(p){ return p.classe; }],
      ["SEER / SCOP", function(p){ return p.seer + " / " + p.scop; }],
      ["Consommation", function(p){ return p.conso + " kWh par an"; }],
      ["Fluide", function(p){ return p.fluide; }],
      ["Bruit intérieur", function(p){ return p.db + " dB(A)"; }],
      ["Pilotage par téléphone", function(p){ return p.wifi ? "oui" : "non"; }],
      ["Prix", function(p){ return prixTexte(p.prix); }]
    ];
    $("#table-comp").innerHTML =
      "<thead><tr><th></th>" + liste.map(function(p){
        return "<th>" + p.nom + "<br><span style=\"font-family:monospace; font-size:11.5px; color:var(--ink-3); font-weight:400\">" + p.ref + "</span></th>";
      }).join("") + "</tr></thead><tbody>" +
      lignes.map(function(l){
        return "<tr><td>" + l[0] + "</td>" + liste.map(function(p){ return '<td class="n">' + l[1](p) + "</td>"; }).join("") + "</tr>";
      }).join("") +
      "<tr><td></td>" + liste.map(function(p){
        return '<td><button class="bouton fort" type="button" data-produit="' + p.ref + '">Voir la fiche</button></td>';
      }).join("") + "</tr></tbody>";
    $("#voile-comp").classList.add("ouvert");
  }

  /* ---------- panier ---------- */
  function totaux(){
    var materiel = 0, poses = 0, articles = 0;
    panier.forEach(function(l){
      var p = trouver(l.ref);
      materiel += p.prix * l.q;
      articles += l.q;
      if (l.pose) poses += POSE * l.q;
    });
    return { materiel: materiel, poses: poses, total: materiel + poses, articles: articles };
  }

  function ajouter(ref, q, pose){
    var l = panier.filter(function(x){ return x.ref === ref && !!x.pose === !!pose; })[0];
    if (l) l.q = Math.min(9, l.q + q); else panier.push({ ref: ref, q: q, pose: !!pose });
    majCompte();
  }

  function majCompte(){
    var t = totaux();
    $("#compte").textContent = t.articles;
    $("#menu-compte").textContent = t.articles + (t.articles > 1 ? " articles" : " article");
    var d3 = $("#detail-3fois");
    if (d3) d3.textContent = "3 x " + euros(Math.round(t.total / 3));
    enregistrer();
    if (etat.ecran === "panier") dessinerPanier();
    if (etat.ecran === "commande") dessinerRecapCommande();
  }

  function recapHTML(bouton){
    var t = totaux();
    return '<h3>Récapitulatif</h3>' +
      '<div class="recap-ligne"><span>Matériel, ' + t.articles + (t.articles > 1 ? " articles" : " article") + '</span><b>' + euros(t.materiel) + '</b></div>' +
      (t.poses ? '<div class="recap-ligne"><span>Pose</span><b>' + euros(t.poses) + '</b></div>' : "") +
      '<div class="recap-ligne"><span>Livraison</span><b>offerte</b></div>' +
      '<div class="recap-total"><span>Total TTC</span><b>' + euros(t.total) + '</b></div>' +
      '<div style="color:var(--ink-3); font-size:12.5px">ou trois fois ' + euros(Math.round(t.total / 3)) + ' sans frais</div>' +
      bouton;
  }

  function dessinerPanier(){
    var t = totaux();
    $("#lignes").innerHTML = panier.length ? panier.map(function(l, i){
      var p = trouver(l.ref);
      return '<div class="ligne">' +
        '<div class="mini">' + visuel(p) + '</div>' +
        '<div><h3>' + p.nom + '</h3>' +
        '<div class="meta">' + p.ref + (l.pose ? ", pose comprise" : "") + '</div>' +
        '<div class="ligne-bas">' +
          '<div class="quantite"><button type="button" data-moins="' + i + '" aria-label="Moins">&minus;</button><span>' + l.q + '</span><button type="button" data-plus="' + i + '" aria-label="Plus">+</button></div>' +
          '<span class="prix">' + euros((p.prix + (l.pose ? POSE : 0)) * l.q) + '</span>' +
          (p.btu ? '<label class="case" style="font-size:13px"><input type="checkbox" data-pose="' + i + '"' + (l.pose ? " checked" : "") + '> Pose ' + euros(POSE) + '</label>' : "") +
          '<button class="supprimer" type="button" data-oter="' + i + '">Retirer</button>' +
        '</div></div></div>';
    }).join("") : '<div class="vide" style="border:1px dashed var(--line-fort); border-radius:var(--r-l); padding:34px; text-align:center; color:var(--ink-2)">Le panier est vide. <button class="bouton" type="button" data-aller="catalogue" style="margin-left:8px">Voir le catalogue</button></div>';

    $("#recap-panier").innerHTML = recapHTML(
      '<button class="bouton fort grand" type="button" id="commander" style="width:100%; margin-top:10px"' + (t.articles ? "" : " disabled") +
        '>' + (etat.mode === "pro" ? "Demander le devis" : "Passer la commande") + '</button>' +
      '<button class="bouton" type="button" data-aller="catalogue" style="width:100%">Continuer mes achats</button>');
  }

  function majAcceptation(){
    var pro = etat.mode === "pro";
    var pose = panier.some(function(l){ return l.pose; });
    $("#texte-accepte").textContent = pro
      ? "J'accepte les conditions générales de vente entre professionnels et j'ai pris connaissance de la politique de confidentialité."
      : "J'ai lu et j'accepte les conditions générales de vente, et j'ai pris connaissance de la politique de confidentialité.";
    $("#rappel-droits").textContent = pro
      ? "Entre professionnels, il n'y a pas de droit de rétractation, sauf si vous employez cinq salariés au plus et que la commande sort de votre activité principale. La garantie des vices cachés reste due."
      : "Quatorze jours pour vous rétracter, à compter du lendemain de la réception, frais de retour à notre charge. Les garanties légales de conformité et des vices cachés s'appliquent en plus de notre garantie de trois ans.";
    $("#ligne-pose-expresse").hidden = !pose || pro;
    if (!pose || pro) $("#accepte-pose").checked = false;
  }

  function dessinerRecapCommande(){
    var t = totaux();
    majAcceptation();
    $("#recap-commande").innerHTML = recapHTML(
      '<button class="bouton braise grand" type="button" id="valider" style="width:100%; margin-top:10px"' + (t.articles ? "" : " disabled") +
        '>' + (etat.mode === "pro" ? "Envoyer la demande" : "Commander avec obligation de paiement") + '</button>' +
      '<small style="color:var(--ink-3)">Maquette : aucun paiement ne sera encaissé.</small>');
  }

  /* ---------- validation ---------- */
  function valider(){
    var manque = null;
    ["nom", "courriel", "tel", "adresse", "cp", "ville"].forEach(function(id){
      var c = document.getElementById(id), ok = c.value.trim() !== "";
      if (ok && id === "courriel") ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.value);
      if (ok && id === "cp") ok = /^[0-9]{5}$/.test(c.value.trim());
      c.classList.toggle("faux", !ok);
      if (!ok && !manque) manque = c;
    });
    if (manque) { manque.focus(); dire("Il manque quelque chose dans ce champ."); return false; }
    var cgv = $("#accepte-cgv");
    if (!cgv.checked) {
      cgv.focus();
      dire(etat.mode === "pro" ? "Il faut accepter les conditions de vente professionnelles." : "Il faut accepter les conditions générales de vente.");
      return false;
    }
    return true;
  }

  function fermerMenu(){
    var m = $("#menu");
    if (m && m.classList.contains("ouvert")) {
      m.classList.remove("ouvert");
      $("#burger").setAttribute("aria-expanded", "false");
    }
  }

  function dire(texte){
    var m = $("#message");
    m.textContent = texte;
    m.classList.add("visible");
    clearTimeout(m.tempo);
    m.tempo = setTimeout(function(){ m.classList.remove("visible"); }, 2600);
  }

  /* ---------- branchements ---------- */
  ["surface", "soleil", "hauteur", "monde"].forEach(function(id){
    document.getElementById(id).addEventListener("input", function(){ calcul(); if (etat.ecran === "catalogue") dessiner(); });
  });

  $("#vers-pupitre").addEventListener("click", function(){
    document.querySelector(".pupitre").scrollIntoView({ behavior: "smooth", block: "center" });
    $("#surface").focus({ preventScroll: true });
  });

  $("#voir-modeles").addEventListener("click", function(){
    if (etat.mode === "pro") return aller("pro");
    etat.filtres.btu = [String(etat.btuConseille)];
    $$('[data-filtre="btu"]').forEach(function(c){ c.checked = c.value === String(etat.btuConseille); });
    aller("catalogue");
  });

  $("#q").addEventListener("input", function(){ etat.q = this.value; dessiner(); });
  $("#tri").addEventListener("change", function(){ etat.tri = this.value; dessiner(); });
  $("#bouton-filtres").addEventListener("click", function(){ $("#filtres").classList.toggle("cache"); });
  $("#prix-max").addEventListener("input", function(){
    etat.filtres.prix = +this.value;
    $("#valeur-prix").textContent = euros(+this.value);
    dessiner();
  });
  $("#vider-filtres").addEventListener("click", function(){
    etat.filtres = { btu: [], tech: [], surface: [], wifi: false, silence: false, prix: 1300 };
    etat.q = "";
    $("#q").value = "";
    $("#prix-max").value = 1300;
    $("#valeur-prix").textContent = euros(1300);
    $$("[data-filtre]").forEach(function(c){ c.checked = false; });
    dessiner();
  });
  $$("[data-filtre]").forEach(function(c){
    c.addEventListener("change", function(){
      var nom = c.dataset.filtre;
      if (nom === "wifi" || nom === "silence") etat.filtres[nom] = c.checked;
      else {
        var l = etat.filtres[nom], i = l.indexOf(c.value);
        if (c.checked && i < 0) l.push(c.value);
        if (!c.checked && i >= 0) l.splice(i, 1);
      }
      dessiner();
    });
  });

  document.addEventListener("click", function(e){
    /* Un clic du milieu, ou avec une touche de commande, ouvre le lien comme
       n'importe quel lien : on ne s'en mêle pas. */
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var lg = e.target.closest("[data-legal]");
    if (lg) {
      e.preventDefault();
      fermerMenu();
      ouvrirLegal(lg.dataset.legal);
      noterAdresse("legal", lg.dataset.legal);
      return;
    }

    var nav = e.target.closest("[data-aller]");
    if (nav) {
      e.preventDefault();
      fermerMenu();
      aller(nav.dataset.aller);
      noterAdresse(nav.dataset.aller);
      if (nav.dataset.ancre) {
        var cible = document.getElementById(nav.dataset.ancre);
        if (cible) setTimeout(function(){ cible.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
      }
      return;
    }

    var met = e.target.closest("[data-metier]");
    if (met) {
      etat.metier = met.dataset.metier;
      reponses = reponsesNeuves(etat.metier);
      etape = 0;
      dessinerMetiers();
      dessinerQuestionnaire();
      dessinerDevis();
      $("#config").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    var pas = e.target.closest("[data-pas]");
    if (pas) {
      etape = Math.min(ETAPES.length - 1, Math.max(0, etape + (+pas.dataset.pas)));
      dessinerQuestionnaire();
      $("#config").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    var saut = e.target.closest("[data-etape]");
    if (saut) {
      etape = +saut.dataset.etape;
      dessinerQuestionnaire();
      return;
    }
    if (e.target.id === "voir-devis") return demanderCompte();
    if (e.target.id === "fermer-compte") {
      societe = null;
      etat.demandeDevis = false;
      try { localStorage.removeItem(CLE_PRO); } catch (ex) {}
      majJetonSociete();
      dessinerPro();
      return dire("Compte quitte. Vous pouvez en ouvrir un autre.");
    }
    if (e.target.id === "envoyer-devis") {
      return dire("Maquette : le devis n'est pas envoyé. Il le serait par courriel, en PDF.");
    }

    if (e.target.closest("[data-accessoires]")) {
      etat.filtres = { btu: [], tech: ["accessoire"], surface: [], wifi: false, silence: false, prix: 1300 };
      $$("[data-filtre]").forEach(function(c){ c.checked = c.dataset.filtre === "tech" && c.value === "accessoire"; });
      fermerMenu();
      return aller("catalogue");
    }

    var prod = e.target.closest("[data-produit]");
    if (prod) {
      $("#voile-comp").classList.remove("ouvert");
      return aller("produit", prod.dataset.produit);
    }

    var puis = e.target.closest("[data-puissance]");
    if (puis) {
      fermerMenu();
      etat.filtres = { btu: [puis.dataset.puissance], tech: [], surface: [], wifi: false, silence: false, prix: 1300 };
      $$('[data-filtre="btu"]').forEach(function(c){ c.checked = c.value === puis.dataset.puissance; });
      $$('[data-filtre="tech"], [data-filtre="wifi"], [data-filtre="silence"]').forEach(function(c){ c.checked = false; });
      return aller("catalogue");
    }

    var plus = e.target.closest("[data-plus]");
    if (plus) { panier[+plus.dataset.plus].q = Math.min(9, panier[+plus.dataset.plus].q + 1); return majCompte(); }
    var moins = e.target.closest("[data-moins]");
    if (moins) {
      var i = +moins.dataset.moins;
      panier[i].q -= 1;
      if (panier[i].q <= 0) panier.splice(i, 1);
      return majCompte();
    }
    var oter = e.target.closest("[data-oter]");
    if (oter) { panier.splice(+oter.dataset.oter, 1); return majCompte(); }

    if (e.target.id === "confirmer-retract") return confirmerRetractation();
    if (e.target.id === "commander") return aller("commande");
    if (e.target.id === "valider") {
      if (!valider()) return;
      var t = totaux();
      var mode = etat.mode === "pro" ? "devis" : document.querySelector('input[name="reglement"]:checked').value;
      $("#numero").textContent = (etat.mode === "pro" ? "DV-2026-" : "HM-2026-") + String(Math.floor(1000 + Math.random() * 9000));
      $("#recap-fin").textContent = t.articles + (t.articles > 1 ? " articles, " : " article, ") + euros(t.total) +
        (mode === "devis" ? ", hors taxes, remise de volume à confirmer" :
         mode === "3fois" ? " en trois fois" : mode === "virement" ? " par virement" : " par carte") +
        ". Un installateur appelle " + $("#nom").value.trim() + " sous 24 heures ouvrées pour fixer le rendez-vous du " +
        $("#creneau").value.toLowerCase() + ".";
      panier = [];
      majCompte();
      return aller("fini");
    }
  });

  $("#creer-compte").addEventListener("click", ouvrirCompte);

  ["kbis"].forEach(function(id){
    document.getElementById(id).addEventListener("change", function(){
      var depot = document.getElementById("depot-" + id);
      var nom = document.getElementById("nom-" + id);
      if (this.files.length) {
        depot.classList.add("rempli");
        depot.classList.remove("faux");
        nom.textContent = this.files[0].name;
      }
    });
  });

  $("#siret").addEventListener("blur", function(){
    if (!this.value.trim()) return;
    var ok = siretValide(this.value);
    $("#aide-siret").textContent = ok ? "Clé de contrôle valide." : "Clé de contrôle refusée. Vérifiez la saisie.";
    $("#aide-siret").classList.toggle("faux", !ok);
    this.classList.toggle("faux", !ok);
  });

  $("#lien-connexion").addEventListener("click", function(){
    dire("Maquette : la connexion enverrait un lien au courriel de la société.");
  });

  $$("[data-mode]").forEach(function(b){
    b.addEventListener("click", function(){
      etat.mode = b.dataset.mode;
      $$("[data-mode]").forEach(function(x){ x.setAttribute("aria-pressed", String(x === b)); });
      majMode();
      dessiner();
      if (etat.ecran === "produit") fiche();
      if (etat.mode === "pro") aller("pro"); else if (etat.ecran === "pro") aller("accueil");
      dire(etat.mode === "pro" ? "Prix affiches hors taxes, remise de volume appliquée au devis." : "Prix affiches toutes taxes comprises.");
    });
  });

  function ecrireReponse(chemin, valeur){
    var bouts = chemin.split(".");
    reponses[bouts[0]][bouts[1]] = valeur;
  }

  function surQuestionnaire(e){
    var d = e.target.dataset;
    if (!d || !reponses) return false;

    if (d.champ) { ecrireReponse(d.champ, +e.target.value || 0); dessinerDevis(); return true; }

    if (d.champEspace) {
      var bouts = d.champEspace.split(".");
      var r = reponses.espaces[bouts[0]];
      r[bouts[1]] = bouts[1] === "hauteur" ? e.target.value : Math.max(1, +e.target.value || 1);
      dessinerDevis();
      return true;
    }

    if (d.radio) { ecrireReponse(d.radio, e.target.value); dessinerDevis(); return true; }

    if (d.espace) {
      reponses.espaces[d.espace].actif = e.target.checked;
      e.target.closest(".espace").classList.toggle("actif", e.target.checked);
      dessinerDevis();
      return true;
    }

    if (d.apport) {
      reponses.apports[d.apport] = e.target.checked;
      e.target.closest(".espace").classList.toggle("actif", e.target.checked);
      dessinerDevis();
      return true;
    }
    return false;
  }

  document.addEventListener("input", surQuestionnaire);

  $("#ouvrir-comparateur").addEventListener("click", ouvrirComparateur);
  $("#fermer-comparateur").addEventListener("click", function(){ $("#voile-comp").classList.remove("ouvert"); });
  $("#voile-comp").addEventListener("click", function(e){ if (e.target === this) this.classList.remove("ouvert"); });
  $("#vider-comparateur").addEventListener("click", function(){
    comparaison = [];
    majComparateur();
    dessiner();
  });

  document.addEventListener("change", function(e){
    if (e.target.dataset && e.target.dataset.lieu) {
      lieu[e.target.dataset.lieu] = e.target.value;
      return dessinerReponsePose();
    }
    if (e.target.dataset && e.target.dataset.comparer) {
      var ref = e.target.dataset.comparer, i = comparaison.indexOf(ref);
      if (e.target.checked && i < 0) {
        if (comparaison.length >= 3) {
          e.target.checked = false;
          return dire("Trois modèles au maximum dans la comparaison.");
        }
        comparaison.push(ref);
      }
      if (!e.target.checked && i >= 0) comparaison.splice(i, 1);
      return majComparateur();
    }
    if (surQuestionnaire(e)) return;
    var pose = e.target.closest("[data-pose]");
    if (pose) { panier[+pose.dataset.pose].pose = pose.checked; majCompte(); }
  });

  /* Bouton retour du navigateur : on retrouve l'écran depuis l'adresse. */
  window.addEventListener("popstate", function(){
    var reste = location.pathname.replace(/index\.html$/, "");
    if (reste.indexOf(BASE) === 0) reste = reste.slice(BASE.length);
    reste = reste.replace(/\/$/, "");
    var onglet = null, ecran = "accueil", k;
    for (k in PAGES_LEGAL) if (PAGES_LEGAL[k] === reste) { ecran = "legal"; onglet = k; }
    if (!onglet) for (k in PAGES) if (PAGES[k] === reste) ecran = k;
    if (ecran === "legal") legalActif = onglet;
    aller(ecran);
  });

  $("#burger").addEventListener("click", function(){
    var ouvert = $("#menu").classList.toggle("ouvert");
    this.setAttribute("aria-expanded", String(ouvert));
  });

  document.documentElement.lang = "fr";
  majMode();
  majComparateur();
  relire();
  lireSociete();
  majJetonSociete();
  calcul();
  dessiner();
  majCompte();
  $("#vedettes").innerHTML = GAMME.filter(function(p){ return p.vedette; }).map(carte).join("");

  /* La page ouverte décide de l'écran affiché. */
  if (depart === "legal") legalActif = departOnglet || "mentions";
  if (depart !== "accueil") aller(depart);
})();
