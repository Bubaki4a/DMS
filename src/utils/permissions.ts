import { User, EducationalDocument, UserRole } from '../types';

/**
 * Checks if a user has permission to view a document based on status, roles, and grade level.
 */
export function canUserViewDocument(user: User, doc: EducationalDocument): boolean {
  if (user.role === 'admin') return true;

  // Author can always see their own documents
  if (doc.author.id === user.id) return true;

  // Teachers can view drafts/pending of other teachers if allowed by role or if public
  if (user.role === 'teacher') {
    if (doc.status === 'approved') {
      return doc.accessPolicy.allowedRoles.includes('teacher');
    }
    // Pedagogical documents or department documents
    if (doc.accessPolicy.allowedRoles.includes('teacher')) {
      return true;
    }
    return false;
  }

  // Students can ONLY view APPROVED documents that include 'student' in allowedRoles
  if (user.role === 'student') {
    if (doc.status !== 'approved') return false;
    if (!doc.accessPolicy.allowedRoles.includes('student')) return false;

    // Never allow students to view internal pedagogical or administrative documents
    if (
      doc.targetGrade === 'Педагогически съвет' ||
      doc.targetGrade === 'Административно ръководство'
    ) {
      return false;
    }

    // Check grade targeting
    if (doc.targetGrade === 'Всички класове' || !user.grade) {
      return true;
    }

    const userGradeNum = user.grade.replace(/[^0-9]/g, '');
    const docGradeNum = doc.targetGrade.replace(/[^0-9]/g, '');

    if (doc.targetGrade === user.grade || (userGradeNum && docGradeNum && userGradeNum === docGradeNum)) {
      return true;
    }

    return false;
  }

  return false;
}

/**
 * Checks if a user has permission to edit or add versions to a document
 */
export function canUserEditDocument(user: User, doc: EducationalDocument): boolean {
  if (user.role === 'admin') return true;

  if (doc.status === 'archived') return false;

  if (user.role === 'teacher') {
    return doc.author.id === user.id;
  }

  if (user.role === 'student') {
    return doc.author.id === user.id && (doc.status === 'draft' || doc.status === 'rejected');
  }

  return false;
}

/**
 * Checks if a user can approve or reject a document
 */
export function canUserApproveDocument(user: User, doc: EducationalDocument): boolean {
  if (user.role === 'admin') return true;

  // Teachers can review student homework/projects in their subject
  if (user.role === 'teacher' && doc.author.role === 'student') {
    return true;
  }

  return false;
}

/**
 * Checks if user can delete a document
 */
export function canUserDeleteDocument(user: User, doc: EducationalDocument): boolean {
  if (user.role === 'admin') return true;
  if (doc.author.id === user.id && (doc.status === 'draft' || doc.status === 'rejected')) {
    return true;
  }
  return false;
}
