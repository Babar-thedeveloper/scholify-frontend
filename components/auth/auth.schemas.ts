import type {
  FieldErrors,
  LoginValues,
  OrgSignupValues,
  StudentSignupValues,
} from "./auth.types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: string): string | undefined {
  if (!value.trim()) return "Email is required";
  if (!EMAIL_RE.test(value.trim())) return "Please enter a valid email address";
  return undefined;
}

function validatePassword(value: string): string | undefined {
  if (!value) return "Password is required";
  if (value.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(value)) return "Include at least one uppercase letter";
  if (!/[0-9]/.test(value)) return "Include at least one number";
  return undefined;
}

function validateUrl(value: string): string | undefined {
  if (!value) return undefined; // optional
  try {
    const u = new URL(value);
    if (!u.protocol.startsWith("http")) return "Please enter a valid URL (include https://)";
    return undefined;
  } catch {
    return "Please enter a valid URL (include https://)";
  }
}

export function validateLogin(values: LoginValues): FieldErrors<LoginValues> {
  const errors: FieldErrors<LoginValues> = {};
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;
  if (!values.password) errors.password = "Password is required";
  return errors;
}

export function validateStudentSignup(
  values: StudentSignupValues
): FieldErrors<StudentSignupValues> {
  const errors: FieldErrors<StudentSignupValues> = {};

  const name = values.fullName.trim();
  if (name.length < 2) errors.fullName = "Name must be at least 2 characters";
  else if (name.length > 100) errors.fullName = "Name is too long";

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  if (!values.university) errors.university = "Please select your university";
  else if (values.university === "Other" && !values.universityOther.trim()) {
    errors.universityOther = "Please enter your university name";
  }

  if (!["undergraduate", "masters", "phd"].includes(values.degreeLevel)) {
    errors.degreeLevel = "Please select your degree level";
  }

  if (!values.termsAccepted) {
    errors.termsAccepted = "You must accept the terms to continue";
  }

  return errors;
}

export function validateOrgSignup(
  values: OrgSignupValues
): FieldErrors<OrgSignupValues> {
  const errors: FieldErrors<OrgSignupValues> = {};

  if (values.organizationName.trim().length < 2) {
    errors.organizationName = "Organization name is required";
  }

  if (!["scholarship-provider", "internship-provider"].includes(values.organizationType)) {
    errors.organizationType = "Please select organization type";
  }

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  if (values.contactName.trim().length < 2) errors.contactName = "Your name is required";
  if (values.designation.trim().length < 2) errors.designation = "Your designation is required";

  const websiteError = validateUrl(values.website);
  if (websiteError) errors.website = websiteError;

  if (!values.country) errors.country = "Please select a country";

  if (!values.termsAccepted) {
    errors.termsAccepted = "You must accept the terms to continue";
  }

  return errors;
}

const PERSONAL_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "live.com"];

export function isPersonalEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) return false;
  return PERSONAL_DOMAINS.includes(domain);
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: "Too short" | "Weak" | "Fair" | "Good" | "Strong";
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (password.length < 8) {
    return { score: password.length === 0 ? 0 : 1, label: "Too short" };
  }
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  if (hasUpper && hasNumber && hasSpecial) return { score: 4, label: "Strong" };
  if (hasUpper && hasNumber) return { score: 3, label: "Good" };
  if (hasUpper || hasNumber) return { score: 2, label: "Fair" };
  return { score: 2, label: "Fair" };
}
