/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */

export interface SignUpBody {
  name: string;
  email: string;
  password: string; // at least 6 characters
}

export interface SignInBody {
  email: string;
  password: string;
}

export interface ForgotPasswordBody {
  email: string;
}

export interface ResetPasswordBody {
  token: string;
  password: string; /* minimum 6 characters */
}

export interface UpdatePasswordBody {
  password: string; /* minimum 6 characters */
}
