import type { ar } from "./ar";

/** French UI strings — mirrors the keys of `ar.ts` (enforced by the type). */
export const fr: Record<keyof typeof ar, string> = {
  // Common
  "common.appName": "Najda",
  "common.tagline":
    "Plateforme nationale de coordination des volontaires et d'aide aux familles touchées par les feux de forêt en Algérie",
  "common.loading": "Chargement…",
  "common.submit": "Envoyer",
  "common.sending": "Envoi en cours…",
  "common.call": "Appeler",
  "common.optional": "facultatif",
  "common.firstName": "Prénom",
  "common.lastName": "Nom",
  "common.fullName": "Nom complet",
  "common.phone": "Numéro de téléphone",
  "common.phoneExample": "ex. : 0550123456",
  "common.password": "Mot de passe",
  "common.wilaya": "Wilaya",
  "common.commune": "Commune",
  "common.neighborhood": "Quartier / zone",
  "common.selectWilaya": "Choisir la wilaya",
  "common.selectCommune": "Choisir la commune",
  "common.allWilayas": "Toutes les wilayas",
  "common.members": "{count} membre(s)",
  "common.backHome": "Retour à l'accueil",
  "common.notFound": "Page introuvable",

  // Backend error keys
  "error.generic": "Une erreur est survenue, réessayez.",
  "error.invalid_phone": "Numéro de téléphone invalide (ex. : 0550123456)",
  "error.invalid_first_name": "Entrez le prénom",
  "error.invalid_last_name": "Entrez le nom",
  "error.invalid_full_name": "Entrez le nom complet",
  "error.invalid_group_name": "Entrez le nom du groupe",
  "error.invalid_location": "Choisissez la wilaya et la commune",
  "error.invalid_category": "Choisissez au moins un type de ressource",
  "error.invalid_needs": "Décrivez les besoins de votre famille",
  "error.password_too_short": "Le mot de passe doit contenir au moins 6 caractères",
  "error.phone_already_used": "Ce numéro dirige déjà un groupe. Vous pouvez vous connecter.",
  "error.invalid_credentials": "Téléphone ou mot de passe incorrect",
  "error.not_logged_in": "Connectez-vous d'abord",
  "error.group_not_found": "Groupe introuvable",
  "error.invalid_photo": "La photo doit être au format JPG, PNG ou WebP",
  "error.photo_too_large": "La photo dépasse 5 Mo",
  "error.invalid_token": "Inscrivez-vous d'abord comme volontaire pour rejoindre",

  // Navigation
  "nav.home": "Accueil",
  "nav.groups": "Groupes de volontaires",
  "nav.volunteer": "Devenir volontaire",
  "nav.resources": "Ressources",
  "nav.help": "Demandes d'aide",
  "nav.missing": "Personnes disparues",
  "nav.leader": "Mon groupe",
  "nav.login": "Connexion chef de groupe",

  // Home
  "home.title": "Najda",
  "home.intro":
    "Une plateforme simple pour se coordonner pendant les feux de forêt : rejoignez un groupe de volontaires près de chez vous, offrez des ressources, demandez de l'aide pour votre famille ou signalez une personne disparue. Sans compte, en moins d'une minute.",
  "home.joinGroup": "Rejoindre un groupe de volontaires",
  "home.joinGroupDesc": "Inscrivez-vous comme volontaire et rejoignez un groupe de votre région",
  "home.createGroup": "Créer un groupe de volontaires",
  "home.createGroupDesc": "Vous êtes chef ? Créez votre groupe et accueillez des volontaires",
  "home.offerResources": "Offrir des ressources",
  "home.offerResourcesDesc": "Eau, nourriture, médicaments, transport… aidez avec ce que vous avez",
  "home.requestHelp": "Demander de l'aide",
  "home.requestHelpDesc": "Votre famille est touchée par les feux ? Demandez ce qu'il vous faut",
  "home.reportMissing": "Signaler une personne disparue",
  "home.reportMissingDesc": "Publiez un signalement pour que chacun puisse aider",

  // Groups
  "groups.title": "Groupes de volontaires",
  "groups.filterHint": "Filtrez les groupes selon votre localisation",
  "groups.neighborhoodSearch": "Rechercher par quartier / zone",
  "groups.join": "Rejoindre",
  "groups.joined": "Vous êtes membre",
  "groups.view": "Voir le groupe",
  "groups.empty": "Aucun groupe dans cette zone pour l'instant. Créez le premier !",
  "groups.createCta": "Créer un nouveau groupe",
  "groups.leader": "Chef : {name}",
  "groups.joinSuccess": "Vous avez rejoint le groupe ! Les contacts des membres sont maintenant visibles.",

  // Group detail
  "group.leaderContact": "Téléphone du chef",
  "group.membersTitle": "Membres",
  "group.noMembers": "Aucun membre pour l'instant",
  "group.publicHint":
    "Rejoignez le groupe pour voir le téléphone du chef, ceux des membres et leurs localisations.",
  "group.joinedAt": "A rejoint {time}",

  // Create group
  "createGroup.title": "Créer un groupe de volontaires",
  "createGroup.intro":
    "Réservé aux chefs de groupe. Créez un compte simple pour accueillir les volontaires et les contacter.",
  "createGroup.groupName": "Nom du groupe",
  "createGroup.submit": "Créer le groupe",
  "createGroup.haveAccount": "Vous avez déjà un groupe ? Connectez-vous",

  // Volunteer registration
  "volunteer.title": "Devenir volontaire",
  "volunteer.intro":
    "Enregistrez vos informations une seule fois, sans compte, puis rejoignez n'importe quel groupe instantanément.",
  "volunteer.submit": "S'inscrire comme volontaire",
  "volunteer.registered": "Inscription réussie ! Choisissez un groupe à rejoindre.",
  "volunteer.alreadyRegistered": "Vous êtes inscrit comme volontaire sous le nom {name}.",
  "volunteer.browseGroups": "Parcourir les groupes",

  // Leader login / dashboard
  "leader.loginTitle": "Connexion chef de groupe",
  "leader.loginSubmit": "Se connecter",
  "leader.noGroup": "Pas encore de groupe ? Créez-en un",
  "leader.dashboard": "Tableau de bord du groupe",
  "leader.logout": "Se déconnecter",
  "leader.notifications": "Notifications",
  "leader.unread": "{count} nouvelle(s)",
  "leader.noNotifications":
    "Aucune notification. Quand un volontaire rejoindra votre groupe, elle apparaîtra ici.",
  "leader.joinedYourGroup": "{name} a rejoint votre groupe",
  "leader.membersTitle": "Membres du groupe",
  "leader.viewPublicPage": "Voir la page publique du groupe",

  // Resources
  "resources.title": "Ressources proposées",
  "resources.offerTitle": "Offrir des ressources",
  "resources.offerIntro":
    "Vous ne pouvez pas participer à la lutte contre le feu ? Aidez avec ce que vous avez. Votre offre sera publique avec votre numéro.",
  "resources.categoriesLabel": "Ressources disponibles",
  "resources.detailsLabel": "Détails supplémentaires",
  "resources.submit": "Publier l'offre",
  "resources.success": "Merci ! Votre offre est maintenant visible par tous.",
  "resources.empty": "Aucune offre de ressources pour l'instant.",
  "resources.offerCta": "Offrir des ressources",
  "resources.category.water": "Eau",
  "resources.category.food": "Nourriture",
  "resources.category.medicine": "Médicaments",
  "resources.category.blankets": "Couvertures",
  "resources.category.clothing": "Vêtements",
  "resources.category.fuel": "Carburant",
  "resources.category.generators": "Groupes électrogènes",
  "resources.category.transportation": "Transport",
  "resources.category.firefighting_equipment": "Matériel de lutte contre le feu",
  "resources.category.first_aid": "Premiers secours",
  "resources.category.other": "Autre",

  // Help requests
  "help.title": "Demandes d'aide",
  "help.requestTitle": "Demander de l'aide",
  "help.requestIntro":
    "Votre famille est touchée par les feux ? Décrivez vos besoins et les volontaires vous contacteront directement.",
  "help.needsLabel": "De quoi avez-vous besoin ?",
  "help.needsPlaceholder": "ex. : Nous avons besoin d'eau et de nourriture pour une famille de 5 personnes…",
  "help.submit": "Envoyer la demande",
  "help.success": "Votre demande est publiée. Les volontaires vous appelleront sur votre numéro.",
  "help.empty": "Aucune demande d'aide pour l'instant.",
  "help.requestCta": "Demander de l'aide",
  "help.chip.water": "Eau",
  "help.chip.food": "Nourriture",
  "help.chip.medicine": "Médicaments",
  "help.chip.evacuation": "Évacuation",
  "help.chip.shelter": "Abri",
  "help.chip.clothing": "Vêtements",
  "help.chip.baby_supplies": "Articles pour bébé",
  "help.chip.other": "Autres besoins",

  // Missing persons
  "missing.title": "Personnes disparues",
  "missing.reportTitle": "Signaler une personne disparue",
  "missing.reportIntro":
    "Remplissez le signalement : il sera visible par tous. Toute personne ayant des informations vous appellera directement.",
  "missing.photo": "Photo de la personne",
  "missing.lastSeen": "Dernier lieu où elle a été vue",
  "missing.lastSeenDetails": "Détails du lieu (village, quartier, repère…)",
  "missing.description": "Description (âge, vêtements, signes distinctifs…)",
  "missing.contactPhone": "Votre numéro pour être contacté",
  "missing.submit": "Publier le signalement",
  "missing.success": "Signalement publié. Nous espérons un retour sain et sauf.",
  "missing.empty": "Aucun signalement pour l'instant.",
  "missing.reportCta": "Signaler une disparition",
  "missing.haveInfo": "Vous avez des informations ?",
};
