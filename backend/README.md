# CustomCraft Backend

Backend Spring Boot avec WebFlux pour l'application de personnalisation de produits CustomCraft.

## Technologies utilisées

- **Spring Boot 3.2.1** - Framework principal
- **Spring WebFlux** - Programmation réactive
- **Spring Data R2DBC** - Accès aux données réactif
- **PostgreSQL** - Base de données principale
- **Redis** - Cache et sessions
- **Spring Security** - Authentification et autorisation
- **JWT** - Tokens d'authentification
- **JavaMail** - Envoi d'emails
- **Lombok** - Réduction du code boilerplate

## Architecture

### Design Patterns utilisés

1. **Repository Pattern** - Abstraction de l'accès aux données
2. **Service Layer Pattern** - Logique métier centralisée
3. **DTO Pattern** - Transfert de données optimisé
4. **Builder Pattern** - Construction d'objets complexes
5. **Strategy Pattern** - Gestion des paiements
6. **Observer Pattern** - Notifications par email

### Structure du projet

```
src/main/java/com/customcraft/
├── config/          # Configuration Spring
├── controller/      # Contrôleurs REST
├── dto/            # Data Transfer Objects
├── model/          # Entités JPA
├── repository/     # Repositories R2DBC
├── security/       # Configuration sécurité
├── service/        # Services métier
└── CustomCraftApplication.java
```

## Configuration

### Base de données PostgreSQL

```sql
CREATE DATABASE customcraft;
CREATE USER customcraft WITH PASSWORD 'customcraft123';
GRANT ALL PRIVILEGES ON DATABASE customcraft TO customcraft;
```

### Variables d'environnement

```bash
# Base de données
DB_URL=r2dbc:postgresql://localhost:5432/customcraft
DB_USERNAME=customcraft
DB_PASSWORD=customcraft123

# JWT
JWT_SECRET=mySecretKey123456789012345678901234567890

# Email
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Paiement
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

## Installation et démarrage

### Prérequis

- Java 17+
- Maven 3.6+
- PostgreSQL 12+
- Redis 6+

### Étapes

1. **Cloner le projet**
```bash
git clone <repository-url>
cd customcraft-backend
```

2. **Configurer la base de données**
```bash
# Créer la base de données PostgreSQL
createdb customcraft
```

3. **Installer les dépendances**
```bash
mvn clean install
```

4. **Démarrer l'application**
```bash
mvn spring-boot:run
```

L'application sera disponible sur `http://localhost:8080`

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/forgot-password` - Mot de passe oublié
- `POST /api/auth/reset-password` - Réinitialiser mot de passe
- `POST /api/auth/verify-email` - Vérifier email

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/{id}` - Détails d'un produit
- `GET /api/products/featured` - Produits mis en avant
- `GET /api/products/popular` - Produits populaires
- `GET /api/products/newest` - Nouveaux produits
- `GET /api/products/{id}/customization-options` - Options de personnalisation

### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders` - Commandes de l'utilisateur
- `GET /api/orders/{id}` - Détails d'une commande
- `POST /api/orders/{id}/payment` - Traiter le paiement
- `PUT /api/orders/{id}/cancel` - Annuler une commande

### Utilisateurs
- `GET /api/users/profile` - Profil utilisateur
- `PUT /api/users/profile` - Mettre à jour le profil
- `POST /api/users/change-password` - Changer le mot de passe

## Fonctionnalités

### Gestion des produits
- Catalogue de produits avec catégories
- Options de personnalisation (couleurs, motifs, texte, tailles)
- Recherche et filtrage avancés
- Gestion des stocks

### Système de commandes
- Panier d'achat persistant
- Processus de commande complet
- Gestion des paiements (simulation Stripe)
- Suivi des commandes
- Notifications par email

### Authentification et sécurité
- Inscription/connexion avec JWT
- Vérification par email
- Réinitialisation de mot de passe
- Autorisation basée sur les rôles
- Protection CORS

### Notifications
- Emails de confirmation d'inscription
- Emails de confirmation de commande
- Notifications de changement de statut
- Emails de réinitialisation de mot de passe

## Tests

```bash
# Exécuter tous les tests
mvn test

# Tests d'intégration
mvn verify
```

## Déploiement

### Docker

```dockerfile
FROM openjdk:17-jdk-slim
COPY target/customcraft-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis
    environment:
      - SPRING_R2DBC_URL=r2dbc:postgresql://postgres:5432/customcraft
      - SPRING_REDIS_HOST=redis

  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: customcraft
      POSTGRES_USER: customcraft
      POSTGRES_PASSWORD: customcraft123
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    
volumes:
  postgres_data:
```

## Monitoring et logs

- Logs structurés avec Logback
- Métriques avec Micrometer
- Health checks Spring Boot Actuator
- Monitoring des performances réactives

## Sécurité

- Validation des données d'entrée
- Protection contre les injections SQL
- Chiffrement des mots de passe avec BCrypt
- Tokens JWT sécurisés
- Configuration CORS restrictive
- Rate limiting (à implémenter)

## Performance

- Architecture réactive avec WebFlux
- Pool de connexions R2DBC optimisé
- Cache Redis pour les données fréquentes
- Pagination des résultats
- Indexation optimisée de la base de données

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.