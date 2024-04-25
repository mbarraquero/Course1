import { AbstractControl, UntypedFormControl, ValidatorFn } from '@angular/forms';

export function ConfirmFieldValidator(fieldName: string, confirmFieldName: string): ValidatorFn {
  return (formControl: AbstractControl) => {
    const errorName = 'notmatching';
    const field = formControl.get(fieldName) as UntypedFormControl;
    const confirmField = formControl.get(confirmFieldName) as UntypedFormControl;
    if (!field || !confirmField) return null;

    if (confirmField.value && field.value !== confirmField.value && !confirmField.getError(errorName)) {
      const errors = { ...(confirmField.errors || {}) };
      errors[errorName] = true;
      confirmField.setErrors(errors);
    } else if (field.value === confirmField.value && confirmField.getError(errorName)) {
      let errors = { ...confirmField.errors };
      delete errors[errorName];
      if (Object.keys(errors).length > 0) confirmField.setErrors(errors);
      else confirmField.setErrors(null);
    }
    return null;
  }
}