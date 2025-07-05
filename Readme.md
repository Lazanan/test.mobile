Voici un exemple complet de `README.md` conforme aux consignes de votre document :

---

# 📱 Application Mobile - Gestion de Produits : AreaStash apk

Cette application mobile, développée avec **React Native (Expo)**, permet de gérer un catalogue de produits, avec authentification, CRUD produit, navigation, et gestion d’état.

---

## Dépôt de base

* Fork du repository : [`https://github.com/paika25/test.mobile.git`](https://github.com/paika25/test.mobile.git)

---

## Installation & Lancement

### Prérequis

* Node.js (v18+)
* Git
* Expo CLI
  Installer avec `npm install -g expo-cli`
* Un émulateur Android/iOS **ou** un appareil physique avec l'app Expo Go

### Étapes

```bash
# 1. Cloner votre fork
git clone https://github.com/Lazanan/test.mobile.git
cd test.mobile

# 2. Installer les dépendances
yarn install

# 3. Lancer l'application
yarn start
```

> Scannez le QR code avec Expo Go pour tester sur mobile 📱

---

## Fonctionnalités Implémentées

### Authentification

* Formulaire d'inscription et de connexion (email / mot de passe)
* Validation de formulaire et gestion d’erreurs
* Stockage local avec `AsyncStorage` pour simuler une session utilisateur

### Produits

* Liste des produits avec pagination, recherche et filtres (catégorie, prix, vendeur, nom du produit)
* Écran de détail d’un produit avec image, description et vendeur
* Ajout / modification / suppression de produits
* Upload d’image et prévisualisation

### Profil Utilisateur

* Informations du compte
* Modification du profil
* Déconnexion
* Statistiques sur les produits créés (bonus)

---

## Architecture du Projet

```
├── app/               # L'application principale gerer par expo router
├── assets/               # Images et fonts
├── src/api/           # Simulation api (utilisant AsyncStorage)
├── src/components/           # Composants réutilisables (Card, Input, Button, etc.)
├── src/data/                 # Données mockées (JSON et JS)
├── src/dtos/             # Data transfer objects
├── src/hooks               # customed hooks
├── src/services               # interaction avec AsyncStorage
├── src/contexts/             # Context API (authentification, produits)
├── src/theme               # Theme de l'application (couleurs, typography, espacement)
├── src/utils/                # Fonctions utilitaires (validation, formatage, etc.)
└── README.md
```

---

## Données Mockées

### `data/products.json`

```json
[
  {
    "id": "1",
    "name": "iPhone 15",
    "description": "Dernier modèle Apple",
    "price": 999.99,
    "stock": 25,
    "category": "Électronique",
    "vendeurs": "TechStore",
    "image": "https://example.com/iphone15.jpg",
    "isActive": true
  }
]
```

### `data/users.js`

```js
export const mockUsers = [
  {
    id: "1",
    email: "test@example.com",
    name: "Daniel",
    password: "password123"
  }
];
```

---

## Choix Techniques

| Aspect           | Choix                       | Justification                        |
| ---------------- | --------------------------- | ------------------------------------ |
| Framework mobile | React Native (Expo)         | Déploiement rapide et cross-platform |
| Navigation       | Expo router                 | Navigation stack et tab fluide       |
| Gestion d’état   | React Hooks + Context API   | Léger et suffisant pour le scope     |
| Authentification | Simulée avec AsyncStorage   | Simule un vrai système de login      |
| Upload d’image   | Via URI ou sélection locale | Compatible Expo Go                   |
| Données          | Fichiers JSON locaux        | Remplace un backend pour ce test     |
| Styles           | `StyleSheet` natif          | Contrôle précis de l’UI              |

---

## Tester l’Application

1. Lancer avec `yarn start`
2. Créez un compte via l’écran d’inscription
3. Naviguez entre les écrans :

   * Ajouter un produit
   * Modifier/supprimer un produit
   * Filtrer/rechercher
   * Voir les détails
4. Déconnectez-vous et reconnectez-vous

---

## Livrables

* Code source complet avec commits clairs
* README avec instructions d’installation et documentation technique
* Données mockées dans `src/data`
* Application fonctionnelle testable via Expo

---

**Auteur :** *LAZANANTENAINA Anjarasoa Daniel*
**Date :** *05/07/2025*

---
