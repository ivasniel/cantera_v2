export interface AcademyProgram {
  id: string;
  ageRange: string;
  title: string;
  description: string;
  image: string;
}

export interface RegistrationLead {
  fullName: string;
  email: string;
  phone: string;
  programId?: string;
}

export interface RegistrationResponse {
  message: string;
  id: string;
}
