export interface APIErrorResponse {
  success: boolean;
  status: number;
  message: string;
  error: {
    code: string;
    details: string | null;
  };
}
