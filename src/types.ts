/**
 * Core Types for Educational Document Management System (EduDoc DMS)
 */

export type UserRole = 'admin' | 'teacher' | 'student';
export type ThemeMode = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
  grade?: string; // e.g. "11А клас"
  subjectSpecialty?: string; // e.g. "Математика и Информатика"
  department?: string; // e.g. "Природо-математически науки"
  positionTitle: string; // e.g. "Директор", "Главен учител", "Ученик"
}

export type DocumentCategoryId =
  | 'curriculum'
  | 'syllabi'
  | 'exam_materials'
  | 'homework_projects'
  | 'admin_orders'
  | 'pedagogical_protocols'
  | 'forms_templates'
  | 'olympiad_competitions';

export interface DocumentCategory {
  id: DocumentCategoryId;
  label: string;
  description: string;
  color: string;
  iconName: string;
}

export type Subject =
  | 'Математика'
  | 'Български език и литература'
  | 'Информатика и ИТ'
  | 'История и цивилизации'
  | 'Английски език'
  | 'Физика и астрономия'
  | 'Биология и ЗО'
  | 'Химия и ООС'
  | 'Общоучилищни'
  | 'Администрация';

export type TargetGrade =
  | 'Всички класове'
  | '8 клас'
  | '9 клас'
  | '10 клас'
  | '11 клас'
  | '12 клас'
  | 'Педагогически съвет'
  | 'Административно ръководство';

export type ApprovalStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';

export interface DocumentVersion {
  id: string;
  versionNumber: string; // e.g. "v1.0", "v1.1", "v2.0"
  uploadedAt: string;
  uploadedBy: User;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'txt' | 'image';
  fileSize: number; // bytes
  changeSummary: string;
  contentSnippet: string;
  checksum: string;
}

export interface ApprovalAction {
  id: string;
  reviewedBy: User;
  reviewedAt: string;
  action: 'approved' | 'rejected' | 'submitted' | 'requested_changes';
  comment: string;
  versionReviewed: string;
}

export interface AccessPolicy {
  allowedRoles: UserRole[];
  allowedGrades: string[];
  isPublicForSchool: boolean;
  canStudentsUploadAnswers?: boolean;
}

export interface AIAnalysis {
  summary: string;
  keyConcepts: string[];
  suggestedTags: string[];
  complianceScore: number;
  complianceFeedback: string;
}

export interface EducationalDocument {
  id: string;
  title: string;
  description: string;
  category: DocumentCategoryId;
  subject: Subject;
  targetGrade: TargetGrade;
  tags: string[];
  status: ApprovalStatus;
  author: User;
  createdAt: string;
  updatedAt: string;
  currentVersion: string;
  versions: DocumentVersion[];
  approvalHistory: ApprovalAction[];
  accessPolicy: AccessPolicy;
  downloadCount: number;
  viewCount: number;
  aiAnalysis?: AIAnalysis;
  rejectionReason?: string;
}

export type AuditActionType =
  | 'VIEW'
  | 'DOWNLOAD'
  | 'UPLOAD'
  | 'EDIT'
  | 'NEW_VERSION'
  | 'ROLLBACK'
  | 'APPROVE'
  | 'REJECT'
  | 'ARCHIVE'
  | 'PERMISSION_UPDATE';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: User;
  action: AuditActionType;
  documentId?: string;
  documentTitle?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: 'SUCCESS' | 'WARNING' | 'DENIED';
}

export interface SystemStats {
  totalDocuments: number;
  pendingApprovals: number;
  approvedCount: number;
  totalDownloads: number;
  totalAuditLogs: number;
  activeUsersCount: number;
}
