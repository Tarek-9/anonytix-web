export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1'

export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'
export const USE_DASHBOARD_MOCKS =
  import.meta.env.VITE_USE_DASHBOARD_MOCKS === 'true'

export const COMPANY_ID =
  import.meta.env.VITE_COMPANY_ID ?? '10729623-735e-4382-854f-33e3450bdac7'
