import { useAuth } from '../contexts/AuthContext';
import { useStaffAuth } from '../contexts/StaffAuthContext';
import { useParentAuth } from '../contexts/ParentAuthContext';

export interface AuthStatus {
  isSchoolAuthenticated: boolean;
  isStaffAuthenticated: boolean;
  isParentAuthenticated: boolean;
  isAnyAuthenticated: boolean;
  currentUserType: 'school' | 'staff' | 'parent' | 'none';
  schoolUser: any;
  staffUser: any;
  parentUser: any;
  isLoading: boolean;
}

export const useAuthStatus = (): AuthStatus => {
  const { 
    isAuthenticated: isSchoolAuthenticated, 
    user: schoolUser, 
    loading: schoolLoading 
  } = useAuth();
  
  const { 
    isAuthenticated: isStaffAuthenticated, 
    user: staffUser, 
    loading: staffLoading 
  } = useStaffAuth();
  
  const { 
    isAuthenticated: isParentAuthenticated, 
    user: parentUser, 
    loading: parentLoading 
  } = useParentAuth();

  const isLoading = schoolLoading || staffLoading || parentLoading;
  const isAnyAuthenticated = isSchoolAuthenticated || isStaffAuthenticated || isParentAuthenticated;

  let currentUserType: 'school' | 'staff' | 'parent' | 'none' = 'none';
  if (isSchoolAuthenticated) currentUserType = 'school';
  else if (isStaffAuthenticated) currentUserType = 'staff';
  else if (isParentAuthenticated) currentUserType = 'parent';

  return {
    isSchoolAuthenticated,
    isStaffAuthenticated,
    isParentAuthenticated,
    isAnyAuthenticated,
    currentUserType,
    schoolUser,
    staffUser,
    parentUser,
    isLoading
  };
};

export default useAuthStatus;
