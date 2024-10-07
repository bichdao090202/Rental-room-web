const isParsableError = (error: unknown): error is Error => {
  return (
    error !== null &&
    typeof error === 'object' &&
    (error as Error).message !== undefined
  );
};

export const checkPermission = (
  permission: string[],
  permissions: string[],
) => {
  return permission.some((p: string) => [...permissions, 'home'].includes(p));
};

export const parseError = (error: unknown): string => {
  if (isParsableError(error)) return error.message;

  return 'Ups... Something went wrong...';
};

const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export const stringAvatar = (name: string) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const lowercaseFirstLetter = (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};
