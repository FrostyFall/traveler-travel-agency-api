function validateInputs(nameInput, phoneInput, emailInput) {
  let validated = { name: false, phone: false, email: false };
  const namePattern = /^([a-zA-Z-]+\s?)+$/;
  const phonePattern = /^\+([0-9]{1,4})\s([0-9]{1,4})\s([0-9]{3})[-. ]?([0-9]{4})$/;
  const emailPattern = /^[a-zA-Z0-9_.]{3,20}@[a-zA-Z0-9-]{1,10}\.[a-zA-Z0-9-.]{1,5}$/;

  if (namePattern.test(nameInput)) {
    validated = { ...validated, name: true };
  }

  if (phonePattern.test(phoneInput)) {
    validated = { ...validated, phone: true };
  }

  if (emailPattern.test(emailInput)) {
    validated = { ...validated, email: true };
  }

  return validated;
}

export default validateInputs;