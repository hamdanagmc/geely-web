import { LeadProps } from "@/app/types/common";

// Identify a lead in WebEngage (https://docs.webengage.com/docs/web-tracking-users).
// The site has no accounts, so the lowercased email is the unique user ID.
export function identifyWebEngageUser({ email, firstName, lastName, phone }: LeadProps) {
  const we = (window as any).webengage;
  if (!we || !email) return;

  we.user.login(email.trim().toLowerCase());
  we.user.setAttribute("we_email", email.trim());
  if (firstName) we.user.setAttribute("we_first_name", firstName);
  if (lastName) we.user.setAttribute("we_last_name", lastName);

  const e164 = (phone || "").replace(/\s/g, ""); // "+971 50..." -> "+97150..."
  if (e164.startsWith("+")) we.user.setAttribute("we_phone", e164);
}
