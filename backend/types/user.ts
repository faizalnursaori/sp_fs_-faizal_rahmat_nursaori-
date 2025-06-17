export interface CreateUserData {
  email: string;
  password: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
}

export interface UserResponse {
  id: string;
  email: string;
}

export interface JwtPayload {
  id: string;
  email: string;
}
