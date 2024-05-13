export interface ConfirmDialogConfig {
  title: string;
  message: string;
  btnOkText: string;
  btnCancelText: string;
};

export const defaultConfig: ConfirmDialogConfig = {
  title: 'Confirmation',
  message: 'Are you sure you want to continue?',
  btnOkText: 'Ok',
  btnCancelText: 'Cancel',
};
