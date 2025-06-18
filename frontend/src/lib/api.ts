const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const TOKEN_KEY = "authToken";

const tokenStorage = {
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  get: () => localStorage.getItem(TOKEN_KEY),
  remove: () => localStorage.removeItem(TOKEN_KEY),
};

async function fetchWithAuth(url: string, options: RequestInit = {}, token?: string) {
  const headers = new Headers(options.headers || {});

  const authToken = token || tokenStorage.get();
  console.log("authToken sent:", tokenStorage.get());

  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Request failed");
  }

  return response.json();
}

export const authService = {
  register: async (email: string, password: string) => {
    const response = await fetchWithAuth("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      tokenStorage.set(response.token);
    }

    return response;
  },

  login: async (email: string, password: string) => {
    const response = await fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      tokenStorage.set(response.token);
    }

    return response;
  },

  isAuthenticated: () => {
    return !!tokenStorage.get();
  },

  logout: () => {
    tokenStorage.remove();
  },

  getProfile: async (token: string) => {
    return fetchWithAuth("/users/me", {}, token);
  },
};

export const userService = {
  getAllUsers: async (token: string) => {
    return fetchWithAuth("/users", {}, token);
  },

  updateUser: async (userId: string, updates: { email?: string }, token: string) => {
    return fetchWithAuth(
      `/users/${userId}`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      },
      token
    );
  },

  deleteUser: async (userId: string, token: string) => {
    return fetchWithAuth(
      `/users/${userId}`,
      {
        method: "DELETE",
      },
      token
    );
  },
};

export const projectService = {
  createProject: async (data: { name: string; description?: string }, token: string) => {
    return fetchWithAuth(
      "/projects",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      token
    );
  },

  getProject: async (projectId: string, token: string) => {
    return fetchWithAuth(`/projects/${projectId}`, {}, token);
  },

  getProjects: async () => {
    return fetchWithAuth("/projects");
  },

  updateProject: async (
    projectId: string,
    updates: { name?: string; description?: string },
    token: string
  ) => {
    return fetchWithAuth(
      `/projects/${projectId}`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      },
      token
    );
  },

  deleteProject: async (projectId: string, token: string) => {
    return fetchWithAuth(
      `/projects/${projectId}`,
      {
        method: "DELETE",
      },
      token
    );
  },

  inviteMember: async (projectId: string, email: string, token: string) => {
    return fetchWithAuth(
      `/projects/${projectId}/invite`,
      {
        method: "POST",
        body: JSON.stringify({ email }),
      },
      token
    );
  },
};

export const taskService = {
  createTask: async (
    projectId: string,
    task: { title: string; description: string; status: string; assigneeId: string },
    token: string
  ) => {
    return fetchWithAuth(
      `/${projectId}/tasks`,
      {
        method: "POST",
        body: JSON.stringify(task),
      },
      token
    );
  },

  getTasks: async (projectId: string, token: string) => {
    return fetchWithAuth(`/${projectId}/tasks`, {}, token);
  },

  updateTask: async (taskId: string, updates: { status?: string }, token: string) => {
    return fetchWithAuth(
      `/task/${taskId}`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      },
      token
    );
  },

  deleteTask: async (taskId: string, token: string) => {
    return fetchWithAuth(
      `/task/${taskId}`,
      {
        method: "DELETE",
      },
      token
    );
  },
};
