export type UserType = "student" | "organization";

export type DegreeLevel = "undergraduate" | "masters" | "phd";

export type OrganizationType = "scholarship-provider" | "internship-provider";

export interface LoginValues {
  email: string;
  password: string;
}

export interface StudentSignupValues {
  fullName: string;
  email: string;
  password: string;
  university: string;
  universityOther: string;
  degreeLevel: DegreeLevel;
  termsAccepted: boolean;
}

export interface OrgSignupValues {
  organizationName: string;
  organizationType: OrganizationType;
  email: string;
  password: string;
  contactName: string;
  designation: string;
  website: string;
  country: string;
  termsAccepted: boolean;
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>;
