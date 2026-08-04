import type { LanguageCode } from "@/lib/i18n/languages";

// UI chrome for src/app/dashboard/staff/page.tsx. Role names themselves
// (OWNER/MANAGER/SERVER/KITCHEN, shown in the table, the invite select and
// the pending-invitation list) are NOT duplicated here -- they come from
// AUTH_DICT.roles (src/lib/i18n/dictionaries/auth.ts), shared with the
// invite page.
export interface StaffDict {
  title: string;
  help: { before: string; bold: string; after: string };
  table: { name: string; email: string; role: string; status: string };
  active: string;
  inactive: string;
  deactivate: string;
  reactivate: string;
  pendingInvitations: string;
  noInvitations: string;
  expiresOn: string;
  inviteMember: string;
  fieldEmail: string;
  fieldRole: string;
  genericError: string;
  emailSentPrefix: string;
  emailNotConfiguredPrefix: string;
  sendInvite: string;
}

export const STAFF_DICT: Record<LanguageCode, StaffDict> = {
  fr: {
    title: "Équipe",
    help: {
      before: "Invitez vos collègues par e-mail avec un ",
      bold: "rôle",
      after:
        " : Manager (accès complet sauf facturation), Serveur (commandes et appels de table) ou Cuisine (commandes uniquement). Chaque invitation envoie un lien à usage unique, valable quelques jours, pour créer leur propre compte.",
    },
    table: { name: "Nom", email: "Email", role: "Rôle", status: "Statut" },
    active: "Actif",
    inactive: "Désactivé",
    deactivate: "Désactiver",
    reactivate: "Réactiver",
    pendingInvitations: "Invitations en attente",
    noInvitations: "Aucune invitation en attente.",
    expiresOn: "expire le ",
    inviteMember: "Inviter un membre",
    fieldEmail: "Email",
    fieldRole: "Rôle",
    genericError: "Erreur inconnue",
    emailSentPrefix: "Email envoyé. Lien d'invitation (au cas où) : ",
    emailNotConfiguredPrefix: "Aucun envoi d'email configuré pour cet environnement — transmettez ce lien manuellement : ",
    sendInvite: "Envoyer l'invitation",
  },
  it: {
    title: "Squadra",
    help: {
      before: "Invita i tuoi colleghi via e-mail con un ",
      bold: "ruolo",
      after:
        ": Manager (accesso completo tranne fatturazione), Cameriere (ordini e chiamate al tavolo) o Cucina (solo ordini). Ogni invito invia un link monouso, valido per alcuni giorni, per creare il proprio account.",
    },
    table: { name: "Nome", email: "Email", role: "Ruolo", status: "Stato" },
    active: "Attivo",
    inactive: "Disattivato",
    deactivate: "Disattiva",
    reactivate: "Riattiva",
    pendingInvitations: "Inviti in sospeso",
    noInvitations: "Nessun invito in sospeso.",
    expiresOn: "scade il ",
    inviteMember: "Invita un membro",
    fieldEmail: "Email",
    fieldRole: "Ruolo",
    genericError: "Errore sconosciuto",
    emailSentPrefix: "Email inviata. Link di invito (nel caso): ",
    emailNotConfiguredPrefix: "Nessun invio email configurato per questo ambiente — trasmetti questo link manualmente: ",
    sendInvite: "Invia l'invito",
  },
  en: {
    title: "Team",
    help: {
      before: "Invite your colleagues by email with a ",
      bold: "role",
      after:
        ": Manager (full access except billing), Server (orders and table calls) or Kitchen (orders only). Each invitation sends a one-time link, valid for a few days, to create their own account.",
    },
    table: { name: "Name", email: "Email", role: "Role", status: "Status" },
    active: "Active",
    inactive: "Disabled",
    deactivate: "Disable",
    reactivate: "Re-enable",
    pendingInvitations: "Pending invitations",
    noInvitations: "No pending invitations.",
    expiresOn: "expires on ",
    inviteMember: "Invite a member",
    fieldEmail: "Email",
    fieldRole: "Role",
    genericError: "Unknown error",
    emailSentPrefix: "Email sent. Invitation link (just in case): ",
    emailNotConfiguredPrefix: "No email sending configured for this environment — share this link manually: ",
    sendInvite: "Send invitation",
  },
  es: {
    title: "Equipo",
    help: {
      before: "Invita a tus compañeros por email con un ",
      bold: "rol",
      after:
        ": Encargado (acceso completo salvo facturación), Camarero (pedidos y llamadas de mesa) o Cocina (solo pedidos). Cada invitación envía un enlace de un solo uso, válido durante unos días, para crear su propia cuenta.",
    },
    table: { name: "Nombre", email: "Email", role: "Rol", status: "Estado" },
    active: "Activo",
    inactive: "Desactivado",
    deactivate: "Desactivar",
    reactivate: "Reactivar",
    pendingInvitations: "Invitaciones pendientes",
    noInvitations: "No hay invitaciones pendientes.",
    expiresOn: "caduca el ",
    inviteMember: "Invitar a un miembro",
    fieldEmail: "Email",
    fieldRole: "Rol",
    genericError: "Error desconocido",
    emailSentPrefix: "Email enviado. Enlace de invitación (por si acaso): ",
    emailNotConfiguredPrefix: "No hay envío de email configurado en este entorno — comparte este enlace manualmente: ",
    sendInvite: "Enviar invitación",
  },
  de: {
    title: "Team",
    help: {
      before: "Laden Sie Ihre Kolleg:innen per E-Mail mit einer ",
      bold: "Rolle",
      after:
        " ein: Manager (voller Zugriff außer Abrechnung), Service (Bestellungen und Tischanrufe) oder Küche (nur Bestellungen). Jede Einladung sendet einen einmaligen Link, einige Tage gültig, zur Erstellung des eigenen Kontos.",
    },
    table: { name: "Name", email: "E-Mail", role: "Rolle", status: "Status" },
    active: "Aktiv",
    inactive: "Deaktiviert",
    deactivate: "Deaktivieren",
    reactivate: "Reaktivieren",
    pendingInvitations: "Ausstehende Einladungen",
    noInvitations: "Keine ausstehenden Einladungen.",
    expiresOn: "läuft ab am ",
    inviteMember: "Mitglied einladen",
    fieldEmail: "E-Mail",
    fieldRole: "Rolle",
    genericError: "Unbekannter Fehler",
    emailSentPrefix: "E-Mail gesendet. Einladungslink (zur Sicherheit): ",
    emailNotConfiguredPrefix: "Kein E-Mail-Versand für diese Umgebung konfiguriert — teilen Sie diesen Link manuell mit: ",
    sendInvite: "Einladung senden",
  },
  ar: {
    title: "الفريق",
    help: {
      before: "ادعُ زملاءك عبر البريد الإلكتروني بتحديد ",
      bold: "دور",
      after:
        ": مدير (وصول كامل باستثناء الفوترة)، نادل (الطلبات ونداءات الطاولة) أو مطبخ (الطلبات فقط). ترسل كل دعوة رابطًا لمرة واحدة، صالحًا لبضعة أيام، لإنشاء حسابهم الخاص.",
    },
    table: { name: "الاسم", email: "البريد الإلكتروني", role: "الدور", status: "الحالة" },
    active: "نشط",
    inactive: "معطّل",
    deactivate: "تعطيل",
    reactivate: "إعادة التفعيل",
    pendingInvitations: "الدعوات المعلّقة",
    noInvitations: "لا توجد دعوات معلّقة.",
    expiresOn: "تنتهي في ",
    inviteMember: "دعوة عضو",
    fieldEmail: "البريد الإلكتروني",
    fieldRole: "الدور",
    genericError: "خطأ غير معروف",
    emailSentPrefix: "تم إرسال البريد الإلكتروني. رابط الدعوة (احتياطًا): ",
    emailNotConfiguredPrefix: "لم تتم تهيئة إرسال البريد الإلكتروني لهذه البيئة — شارك هذا الرابط يدويًا: ",
    sendInvite: "إرسال الدعوة",
  },
};
