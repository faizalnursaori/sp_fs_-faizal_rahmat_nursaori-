export interface CreateUserData {
  email: string;
  password: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
}
