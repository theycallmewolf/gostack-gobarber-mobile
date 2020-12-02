import { ValidationError } from 'yup';

interface myErrors {
  [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): myErrors {
  const validationErrors: myErrors = {};
  err.inner.forEach(error => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}
