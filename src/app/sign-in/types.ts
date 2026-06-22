export type RegisterFieldErrors = Partial<
  Record<
    | "title"
    | "firstName"
    | "lastName"
    | "email"
    | "phone"
    | "schoolNumber"
    | "batch",
    string
  >
>;

export type RegisterState = {
  success: boolean;
  message: string;
  errors: RegisterFieldErrors;
};

export const initialRegisterState: RegisterState = {
  success: false,
  message: "",
  errors: {},
};
