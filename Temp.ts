{/* Create Case Validations */}

register('firstName', {
  maxLength: { value: 50, message: 'Name should be within 50 characters' },
  pattern: {
    value: /^(?!\s)([a-zA-Z0-9-.'(0)="_&]{1,50})$/,
    message: 'Invalid first name format',
  },
});

register('lastName', {
  maxLength: { value: 50, message: 'Name should be within 50 characters' },
  pattern: {
    value: /^(?!\s)([a-zA-Z0-9-.'(0)="_&]{1,50})$/,
    message: 'Invalid last name format',
  },
});

register('mail', {
  maxLength: { value: 256, message: 'Email should be within 256 characters' },
  pattern: {
    value: /^(?=.{1,256}$)^([a-zA-Z0-9.!#$%&'*+V=?^_`~-]{1,64})@(([a-zA-Z0-9-]{1,180}(\.[a-zA-Z0-9-]{1,62}){1,9}))$/,
    message: 'Please enter a valid email address',
  },
});

register('customerReferenceId', {
  maxLength: { value: 10, message: 'Customer Reference Number should be 10 characters' },
  pattern: {
    value: /^[0-9]{10,10}$/,
    message: 'Customer Reference Number must be exactly 10 digits',
  },
});

register('sourceSystemID', {
  maxLength: { value: 100, message: 'sourceSystemID should be within 100 characters' },
  pattern: {
    value: /^[a-zA-Z0-9-.#$&'*+/=_^]{1,100}$/,
    message: 'Invalid source system ID format',
  },
});

register('notes', {
  maxLength: { value: 3000, message: 'Notes should be within 3000 characters' },
  pattern: {
    value: /^[a-zA-Z0-9-.#$&'*+/=£_^]{1,3000}$/,
    message: 'Invalid notes format',
  },
});

const validateAge = (value: Date) => {
  if (value) {
    const today = new Date();
    const selectedDate = new Date(value);
    const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return selectedDate <= minDate || 'Age must be at least 18 years old';
  }
  return 'Date of birth is required';
};