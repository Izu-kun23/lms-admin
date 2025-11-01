import axios, { AxiosInstance, AxiosError } from "axios"
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  Organization,
  User,
  Course,
  GlobalStats,
  SystemHealth,
  ApiResponse,
  PaginatedResponse,
} from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://lms-backend-k5t6.onrender.com"
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1"

class ApiClient {
  private client: AxiosInstance
  private refreshTokenPromise: Promise<string> | null = null

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 60000, // 60 seconds - increased for Render.com cold starts
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor - attach auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any

        // If error is 401 and not already trying to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const newToken = await this.refreshAccessToken()
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return this.client(originalRequest)
          } catch (refreshError) {
            // Refresh failed - logout user
            this.clearTokens()
            if (typeof window !== "undefined") {
              window.location.href = "/login"
            }
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  // Token management
  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("accessToken")
  }

  private getRefreshToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("refreshToken")
  }

  setTokens(accessToken: string, refreshToken: string) {
    if (typeof window === "undefined") return
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
  }

  clearTokens() {
    if (typeof window === "undefined") return
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
  }

  private async refreshAccessToken(): Promise<string> {
    // Prevent multiple simultaneous refresh calls
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise
    }

    this.refreshTokenPromise = (async () => {
      try {
        const refreshToken = this.getRefreshToken()
        if (!refreshToken) {
          throw new Error("No refresh token")
        }

        const response = await axios.post(
          `${API_BASE_URL}/api/${API_VERSION}/auth/refresh`,
          { refreshToken },
          {
            headers: { "Content-Type": "application/json" },
          }
        )

        const { accessToken, refreshToken: newRefreshToken } = response.data

        this.setTokens(accessToken, newRefreshToken)

        return accessToken
      } finally {
        this.refreshTokenPromise = null
      }
    })()

    return this.refreshTokenPromise
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Login endpoint - only requires email and password
      // Increased timeout specifically for login to handle cold starts
      const response = await this.client.post<LoginResponse>(
        "/auth/login",
        {
          email: credentials.email,
          password: credentials.password,
        },
        {
          timeout: 60000, // 60 seconds for cold start scenarios
        }
      )
      
      // Handle both possible response structures
      const data = response.data as any
      const accessToken = data.accessToken || data.token
      const refreshToken = data.refreshToken || data.refresh
      
      if (!accessToken || !refreshToken) {
        throw new Error("Invalid response from server: missing tokens")
      }
      
      if (!data.user) {
        throw new Error("Invalid response from server: missing user data")
      }
      
      this.setTokens(accessToken, refreshToken)
      return {
        accessToken,
        refreshToken,
        user: data.user
      }
    } catch (error: any) {
      console.error("Login API error:", error)
      
      // Handle timeout specifically
      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        throw new Error(
          "Request timed out. The server may be starting up (cold start). " +
          "Please try again in a few moments. This usually takes 30-60 seconds on the first request."
        )
      }
      
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error || 
                            "Login failed"
        throw new Error(errorMessage)
      } else if (error.request) {
        // Request made but no response
        throw new Error(
          "Unable to reach the server. Please check your internet connection and try again. " +
          "If this is the first request, the server may be starting up (cold start)."
        )
      } else {
        // Error in setting up request
        throw new Error(error.message || "Login failed")
      }
    }
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await this.client.post<RegisterResponse>("/auth/register", data)
    const { accessToken, refreshToken } = response.data
    this.setTokens(accessToken, refreshToken)
    return response.data
  }

  async logout(): Promise<void> {
    try {
      await this.client.post("/auth/logout")
    } finally {
      this.clearTokens()
    }
  }

  // Organizations
  async getOrganizations(): Promise<Organization[]> {
    const response = await this.client.get<Organization[]>("/organizations")
    return response.data
  }

  async getOrganization(id: string): Promise<Organization> {
    const response = await this.client.get<Organization>(`/organizations/${id}`)
    return response.data
  }

  async getOrganizationBySlug(slug: string): Promise<Organization> {
    const response = await this.client.get<Organization>(`/organizations/slug/${slug}`)
    return response.data
  }

  async createOrganization(data: CreateOrganizationRequest): Promise<Organization> {
    const response = await this.client.post<Organization>("/organizations", data)
    return response.data
  }

  async updateOrganization(id: string, data: UpdateOrganizationRequest): Promise<Organization> {
    const response = await this.client.put<Organization>(`/organizations/${id}`, data)
    return response.data
  }

  async deleteOrganization(id: string): Promise<void> {
    await this.client.delete(`/organizations/${id}`)
  }

  async getOrganizationStats(id: string): Promise<any> {
    const response = await this.client.get(`/organizations/${id}/stats`)
    return response.data
  }

  // Admin & Stats
  async getGlobalStats(): Promise<GlobalStats> {
    const response = await this.client.get<GlobalStats>("/admin/stats")
    return response.data
  }

  async getUserStats(organizationId?: string): Promise<any> {
    const url = organizationId ? `/admin/stats/users?organizationId=${organizationId}` : "/admin/stats/users"
    const response = await this.client.get(url)
    return response.data
  }

  async getCourseStats(organizationId?: string): Promise<any> {
    const url = organizationId ? `/admin/stats/courses?organizationId=${organizationId}` : "/admin/stats/courses"
    const response = await this.client.get(url)
    return response.data
  }

  async getAllUsers(organizationId?: string): Promise<User[]> {
    const url = organizationId === "all" ? `/admin/users?organizationId=all` : organizationId ? `/admin/users?organizationId=${organizationId}` : "/admin/users"
    const response = await this.client.get<User[]>(url)
    return response.data
  }

  async getUser(id: string): Promise<User> {
    const response = await this.client.get<User>(`/users/${id}`)
    return response.data
  }

  async createUser(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: string
    organizationId?: string
    matricNumber?: string
  }): Promise<User> {
    const response = await this.client.post<User>("/admin/users", data)
    return response.data
  }

  async updateUser(id: string, data: {
    firstName?: string
    lastName?: string
    email?: string
    matricNumber?: string
  }): Promise<User> {
    const response = await this.client.put<User>(`/admin/users/${id}`, data)
    return response.data
  }

  async updateUserRole(id: string, role: string): Promise<User> {
    const response = await this.client.put<User>(`/admin/users/${id}/role`, { role })
    return response.data
  }

  async deleteUser(id: string): Promise<void> {
    await this.client.delete(`/admin/users/${id}`)
  }

  async getEnrollments(organizationId?: string): Promise<any[]> {
    const url = organizationId ? `/admin/enrollments?organizationId=${organizationId}` : "/admin/enrollments"
    const response = await this.client.get<any[]>(url)
    return response.data
  }

  async getEnrollment(id: string): Promise<any> {
    const response = await this.client.get(`/admin/enrollments/${id}`)
    return response.data
  }

  async createEnrollment(userId: string, courseId: string): Promise<any> {
    const response = await this.client.post("/admin/enrollments", { userId, courseId })
    return response.data
  }

  async updateEnrollment(id: string, data: { status?: string }): Promise<any> {
    const response = await this.client.put(`/admin/enrollments/${id}`, data)
    return response.data
  }

  async deleteEnrollment(id: string): Promise<void> {
    await this.client.delete(`/admin/enrollments/${id}`)
  }

  // Courses
  async getCourses(organizationId?: string): Promise<Course[]> {
    const url = organizationId ? `/courses?organizationId=${organizationId}` : "/courses"
    const response = await this.client.get<Course[]>(url)
    return response.data
  }

  async getCourse(id: string): Promise<Course> {
    const response = await this.client.get<Course>(`/courses/${id}`)
    return response.data
  }

  // Health
  async getHealth(): Promise<SystemHealth> {
    const response = await this.client.get<SystemHealth>("/health")
    return response.data
  }

  async getGlobalHealth(): Promise<any> {
    const response = await this.client.get("/health/global")
    return response.data
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export for direct use in components
export default apiClient

