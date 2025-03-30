import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import Swal from 'sweetalert2';
export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = async (component, currentRoute, currentState, nextState) => {
  if (component.editForm?.dirty) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text : 'Leaving this page will discard unsaved changes. Do you wish to continue?',
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, discard changes"
    });

    return result.isConfirmed;
  }
  return true;
};
