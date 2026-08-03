import type { LanguageCode } from "@/lib/i18n/languages";

// UI chrome for the three auth pages (login, signup, invite) plus the
// shared AuthShell/OAuthButtons they're built from. `roles` is shared with
// the dashboard sidebar (src/app/dashboard/layout.tsx) so a role name
// never reads differently between "you were invited as X" and "your role
// is X" once you're actually in.
export interface AuthDict {
  oauth: { google: string; apple: string; or: string; notConfigured: string; failed: string };
  fields: { email: string; password: string; passwordMin: string; yourName: string; restaurantName: string };
  login: { title: string; submit: string; submitting: string; tooManyAttempts: string; invalidCredentials: string; genericError: string };
  signup: { title: string; subtitle: string; submit: string; submitting: string; genericError: string };
  invite: {
    invalidTitle: string;
    invalidBody: string;
    joinPrefix: string;
    invitationFor: string;
    roleLabel: string;
    submit: string;
    submitting: string;
    genericError: string;
  };
  roles: { OWNER: string; MANAGER: string; SERVER: string; KITCHEN: string };
}

export const AUTH_DICT: Record<LanguageCode, AuthDict> = {
  fr: {
    oauth: {
      google: "Continuer avec Google",
      apple: "Continuer avec Apple",
      or: "ou",
      notConfigured: "Connexion indisponible sur cet environnement (clé API manquante).",
      failed: "La connexion a échoué, réessayez ou utilisez votre mot de passe.",
    },
    fields: { email: "Email", password: "Mot de passe", passwordMin: "Mot de passe (10 caractères min.)", yourName: "Votre nom", restaurantName: "Nom du restaurant" },
    login: {
      title: "Connexion",
      submit: "Se connecter",
      submitting: "Connexion…",
      tooManyAttempts: "Trop de tentatives.",
      invalidCredentials: "Email ou mot de passe incorrect",
      genericError: "Erreur inconnue",
    },
    signup: {
      title: "Créer mon restaurant",
      subtitle: "Essai gratuit, sans carte bancaire.",
      submit: "Créer le compte",
      submitting: "Création…",
      genericError: "Erreur inconnue",
    },
    invite: {
      invalidTitle: "Invitation invalide",
      invalidBody: "Ce lien d'invitation est invalide ou a expiré.",
      joinPrefix: "Rejoindre ",
      invitationFor: "Invitation pour",
      roleLabel: "rôle",
      submit: "Activer mon compte",
      submitting: "Activation…",
      genericError: "Erreur inconnue",
    },
    roles: { OWNER: "Propriétaire", MANAGER: "Manager", SERVER: "Serveur", KITCHEN: "Cuisine" },
  },

  it: {
    oauth: {
      google: "Continua con Google",
      apple: "Continua con Apple",
      or: "oppure",
      notConfigured: "Accesso non disponibile in questo ambiente (chiave API mancante).",
      failed: "Accesso non riuscito, riprova o usa la password.",
    },
    fields: { email: "Email", password: "Password", passwordMin: "Password (min. 10 caratteri)", yourName: "Il tuo nome", restaurantName: "Nome del ristorante" },
    login: {
      title: "Accedi",
      submit: "Accedi",
      submitting: "Accesso…",
      tooManyAttempts: "Troppi tentativi.",
      invalidCredentials: "Email o password errati",
      genericError: "Errore sconosciuto",
    },
    signup: {
      title: "Crea il tuo ristorante",
      subtitle: "Prova gratuita, senza carta di credito.",
      submit: "Crea account",
      submitting: "Creazione…",
      genericError: "Errore sconosciuto",
    },
    invite: {
      invalidTitle: "Invito non valido",
      invalidBody: "Questo link di invito non è valido o è scaduto.",
      joinPrefix: "Unisciti a ",
      invitationFor: "Invito per",
      roleLabel: "ruolo",
      submit: "Attiva il mio account",
      submitting: "Attivazione…",
      genericError: "Errore sconosciuto",
    },
    roles: { OWNER: "Proprietario", MANAGER: "Manager", SERVER: "Cameriere", KITCHEN: "Cucina" },
  },

  en: {
    oauth: {
      google: "Continue with Google",
      apple: "Continue with Apple",
      or: "or",
      notConfigured: "Sign-in unavailable in this environment (missing API key).",
      failed: "Sign-in failed, try again or use your password.",
    },
    fields: { email: "Email", password: "Password", passwordMin: "Password (10 characters min.)", yourName: "Your name", restaurantName: "Restaurant name" },
    login: {
      title: "Log in",
      submit: "Log in",
      submitting: "Logging in…",
      tooManyAttempts: "Too many attempts.",
      invalidCredentials: "Incorrect email or password",
      genericError: "Unknown error",
    },
    signup: {
      title: "Create your restaurant",
      subtitle: "Free trial, no credit card required.",
      submit: "Create account",
      submitting: "Creating…",
      genericError: "Unknown error",
    },
    invite: {
      invalidTitle: "Invalid invitation",
      invalidBody: "This invitation link is invalid or has expired.",
      joinPrefix: "Join ",
      invitationFor: "Invitation for",
      roleLabel: "role",
      submit: "Activate my account",
      submitting: "Activating…",
      genericError: "Unknown error",
    },
    roles: { OWNER: "Owner", MANAGER: "Manager", SERVER: "Server", KITCHEN: "Kitchen" },
  },

  es: {
    oauth: {
      google: "Continuar con Google",
      apple: "Continuar con Apple",
      or: "o",
      notConfigured: "Inicio de sesión no disponible en este entorno (falta la clave API).",
      failed: "El inicio de sesión ha fallado, inténtalo de nuevo o usa tu contraseña.",
    },
    fields: { email: "Email", password: "Contraseña", passwordMin: "Contraseña (mín. 10 caracteres)", yourName: "Tu nombre", restaurantName: "Nombre del restaurante" },
    login: {
      title: "Acceder",
      submit: "Acceder",
      submitting: "Accediendo…",
      tooManyAttempts: "Demasiados intentos.",
      invalidCredentials: "Email o contraseña incorrectos",
      genericError: "Error desconocido",
    },
    signup: {
      title: "Crea tu restaurante",
      subtitle: "Prueba gratuita, sin tarjeta de crédito.",
      submit: "Crear cuenta",
      submitting: "Creando…",
      genericError: "Error desconocido",
    },
    invite: {
      invalidTitle: "Invitación no válida",
      invalidBody: "Este enlace de invitación no es válido o ha caducado.",
      joinPrefix: "Unirte a ",
      invitationFor: "Invitación para",
      roleLabel: "rol",
      submit: "Activar mi cuenta",
      submitting: "Activando…",
      genericError: "Error desconocido",
    },
    roles: { OWNER: "Propietario", MANAGER: "Encargado", SERVER: "Camarero", KITCHEN: "Cocina" },
  },

  de: {
    oauth: {
      google: "Weiter mit Google",
      apple: "Weiter mit Apple",
      or: "oder",
      notConfigured: "Anmeldung in dieser Umgebung nicht verfügbar (API-Schlüssel fehlt).",
      failed: "Anmeldung fehlgeschlagen, versuchen Sie es erneut oder nutzen Sie Ihr Passwort.",
    },
    fields: { email: "E-Mail", password: "Passwort", passwordMin: "Passwort (mind. 10 Zeichen)", yourName: "Ihr Name", restaurantName: "Name des Restaurants" },
    login: {
      title: "Anmelden",
      submit: "Anmelden",
      submitting: "Anmeldung…",
      tooManyAttempts: "Zu viele Versuche.",
      invalidCredentials: "E-Mail oder Passwort falsch",
      genericError: "Unbekannter Fehler",
    },
    signup: {
      title: "Restaurant erstellen",
      subtitle: "Kostenlose Testphase, keine Kreditkarte nötig.",
      submit: "Konto erstellen",
      submitting: "Wird erstellt…",
      genericError: "Unbekannter Fehler",
    },
    invite: {
      invalidTitle: "Ungültige Einladung",
      invalidBody: "Dieser Einladungslink ist ungültig oder abgelaufen.",
      joinPrefix: "Beitreten: ",
      invitationFor: "Einladung für",
      roleLabel: "Rolle",
      submit: "Konto aktivieren",
      submitting: "Aktivierung…",
      genericError: "Unbekannter Fehler",
    },
    roles: { OWNER: "Inhaber", MANAGER: "Manager", SERVER: "Service", KITCHEN: "Küche" },
  },

  ar: {
    oauth: {
      google: "المتابعة باستخدام Google",
      apple: "المتابعة باستخدام Apple",
      or: "أو",
      notConfigured: "تسجيل الدخول غير متاح في هذه البيئة (مفتاح API مفقود).",
      failed: "فشل تسجيل الدخول، أعد المحاولة أو استخدم كلمة المرور.",
    },
    fields: { email: "البريد الإلكتروني", password: "كلمة المرور", passwordMin: "كلمة المرور (١٠ أحرف على الأقل)", yourName: "اسمك", restaurantName: "اسم المطعم" },
    login: {
      title: "تسجيل الدخول",
      submit: "تسجيل الدخول",
      submitting: "جارٍ تسجيل الدخول…",
      tooManyAttempts: "عدد كبير جدًا من المحاولات.",
      invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      genericError: "خطأ غير معروف",
    },
    signup: {
      title: "أنشئ مطعمك",
      subtitle: "تجربة مجانية، دون بطاقة ائتمان.",
      submit: "إنشاء الحساب",
      submitting: "جارٍ الإنشاء…",
      genericError: "خطأ غير معروف",
    },
    invite: {
      invalidTitle: "دعوة غير صالحة",
      invalidBody: "رابط الدعوة هذا غير صالح أو انتهت صلاحيته.",
      joinPrefix: "انضم إلى ",
      invitationFor: "دعوة لـ",
      roleLabel: "الدور",
      submit: "تفعيل حسابي",
      submitting: "جارٍ التفعيل…",
      genericError: "خطأ غير معروف",
    },
    roles: { OWNER: "مالك", MANAGER: "مدير", SERVER: "نادل", KITCHEN: "مطبخ" },
  },
};
