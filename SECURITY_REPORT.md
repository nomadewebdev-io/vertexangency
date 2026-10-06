# Rapport d'Audit de Sécurité et de Remédiation

**Date de l'audit :** 2026-10-06 12:52:00 UTC  
**Statut global :** Audit et remédiation automatique appliqués avec succès  

---

## 1. Tableau des Failles Identifiées et Corrigées

| Sévérité | Fichier:Ligne | Faille | Risque | Correctif appliqué |
| :--- | :--- | :--- | :--- | :--- |
| Haute | `js/main.js:72` | DOM XSS et injection de protocole dans le rendu des cartes projets | Exécution arbitraire de scripts via pseudo-protocoles (`javascript:`) ou caractères spéciaux non échappés | Échappement HTML systématique (`escapeHTML()`), filtrage strict des URLs (`sanitizeUrl()`) et injection sécurisée via `setSafeHTML()` (DOMParser sandboxed) |
| Haute | `js/main.js:294` | DOM XSS et gestionnaire inline `onclick` dans la modale projet | Exécution de scripts malveillants et contournement/violation de la Content Security Policy | Nettoyage des données du projet, remplacement de l'attribut `onclick` inline par un écouteur `addEventListener`, et rendu via `setSafeHTML()` |
| Haute | `js/main.js:444` | DOM XSS potentiel dans les notifications toast | Injection de code HTML arbitraire via le paramètre de message | Rendu du texte via `textContent` pur (neutralisation absolue de balises), icônes vectorielles SVG intégrées proprement sans emojis |
| Haute | `package.json:14` | CVE `source-map-js` (1.0.0 - 1.2.1 - GHSA-68fv-2mgg-jv7q) | Déni de service (DoS) sur l'event-loop via offsets de source-maps contrefaits | Dépendance mise à jour vers version sécurisée via `npm audit fix` |
| Haute | `package.json:14` | CVE `vite` (<=6.4.2 - GHSA-4w7w-66w2-5vf9, GHSA-fx2h-pf6j-xcff) | Traversée de chemin et contournement de la deny list sous Windows | Mise à niveau vers la version stable moderne `vite@8.3.3` |
| Moyenne | `package.json:14` | CVE `esbuild` (<=0.24.2 - GHSA-67mh-4wv8-2f99) | Requêtes cross-origin non autorisées vers le serveur de développement | Résolu via la montée de version de Vite (`vite@8.3.3`) et mise à niveau d'esbuild sous-jacent |
| Haute | `.gitignore:1` | Absence de règle `.env*`, certificats et clés privées dans `.gitignore` | Fuite accidentelle de variables d'environnement, clés d'API et certificats dans git | Ajout des règles d'exclusion pour `.env*`, `*.pem`, `*.key`, `*.cert`, `*.pfx`, etc., et création du modèle `.env.example` |
| Moyenne | `vite.config.js:1` | Absence d'en-têtes HTTP de sécurité et restrictions système | Sensibilité au Clickjacking, MIME-sniffing et fuite d'informations d'origine | Configuration des en-têtes `X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` et activation de `fs.strict: true` |
| Moyenne | `index.html:7`, `portfolio.html:7` | Absence de Content Security Policy (CSP) et meta de sécurité | Vulnérabilité aux injections de scripts et ressources externes non maîtrisées | Déploiement d'une balise `<meta http-equiv="Content-Security-Policy">` stricte, `X-Content-Type-Options: nosniff` et `Referrer-Policy: strict-origin-when-cross-origin` |
| Basse | `js/main.js:365` | Absence de limitation de fréquence (Rate Limiting) et de bornes sur le formulaire de contact | Vulnérabilité au spam automatisé, flood et payloads volumineux | Mise en place d'un cooldown de 4 secondes entre envois et validation stricte des longueurs maximales (nom <= 100, email <= 150, message <= 2500) |

---

## 2. Secrets Détectés à Renouveler Immédiatement

> [!NOTE]
> Aucun secret réel, token d'API ou mot de passe en dur n'a été trouvé dans le code source ni dans l'historique git du projet. Le fichier modèle `.env.example` a été mis en place pour garantir l'étanchéité future des configurations sensibles.

| Secret Détecté | Service / Type | Variable d'Environnement | Action requise |
| :--- | :--- | :--- | :--- |
| *Aucun* | N/A | N/A | Aucune révocation nécessaire : aucun secret n'a été exposé |

---

## 3. Modifications à Vérifier Manuellement [À VÉRIFIER]

Les modifications suivantes ont été appliquées pour durcir la sécurité applicative et prévenir les vulnérabilités de manière pérenne :
- **[À VÉRIFIER : vite.config.js & package.json]** : Mise à jour de Vite vers `v8.3.3`. Les commandes de build (`npm run build`) et le serveur de dev ont été testés avec succès et 0 erreur. Vérifier le bon rechargement HMR dans les navigateurs clients cibles.
- **[À VÉRIFIER : index.html & portfolio.html]** : Politique Content Security Policy (CSP) déployée (`default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';`). Si de futures API externes, trackers ou polices distantes sont ajoutés, penser à ajouter leurs domaines à la directive CSP.

---

## 4. Dépendances et CVEs

- **Résultat de l'analyse initiale :** 3 vulnérabilités détectées (2 Hautes : `vite`, `source-map-js` ; 1 Moyenne : `esbuild`).
- **Actions appliquées :**
  - Exécution de `npm audit fix` pour patcher `source-map-js`.
  - Mise à niveau de `vite` vers la version sécurisée `8.3.3`.
- **Résultat final `npm audit` :** **0 vulnérabilité** détectée (`found 0 vulnerabilities`).
