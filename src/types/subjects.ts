export interface Subject {
  id: number;
  school_id: number;
  school_name: string;
  subject_name: string;
  subject_code: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubjectCreateData {
  subject_name: string;
  subject_code: string;
  description?: string;
  is_active: boolean;
}

export interface SubjectStats {
  total_subjects: number;
  active_subjects: number;
  inactive_subjects: number;
}

export interface SubjectResponse {
  success: boolean;
  message?: string;
  data?: {
    results: Subject[];
    count: number;
    next?: string;
    previous?: string;
  };
  errors?: Record<string, string[]>;
}

export interface SubjectStatsResponse {
  success: boolean;
  data?: SubjectStats;
  message?: string;
}

export interface CSVUploadResponse {
  success: boolean;
  message: string;
  data?: {
    created_count: number;
    subjects: Subject[];
  };
  warnings?: string[];
  errors?: Record<string, string[]>;
}
