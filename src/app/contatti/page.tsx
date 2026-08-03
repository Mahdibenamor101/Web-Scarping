import LandingNav from "@/components/landing-nav";
import LandingFooter from "@/components/landing-footer";
import ContactForm from "./contact-form";
import { getLocale } from "@/lib/i18n/get-locale";

// A server shell so the nav/footer can resolve the visitor's language
// (see CONTEXT.md §12.30); the interactive form itself lives in
// contact-form.tsx as a client component.
export default function ContactPage() {
  const locale = getLocale("it");
  return (
    <div className="min-h-screen bg-paper">
      <LandingNav locale={locale} />
      <ContactForm />
      <LandingFooter />
    </div>
  );
}
