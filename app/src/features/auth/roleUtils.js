export const hasOwnerRole = (role) => role === 'OWNER' || role === 'BOTH';

export const hasDriverRole = (role) => role === 'DRIVER' || role === 'BOTH';

export const getRoleLabel = (role) => {
  if (role === 'BOTH') return 'Conductor y Propietario';
  if (role === 'DRIVER') return 'Conductor';
  if (role === 'OWNER') return 'Propietario';
  return '';
};

