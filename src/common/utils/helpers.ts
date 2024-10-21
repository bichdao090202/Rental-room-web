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

export function formatCurrency(price: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export function formatDay(date: Date): string {
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDatetime(datetime: Date): string {
  return datetime.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

// export const getBase64FromPdf = async (file: File): Promise<string | null> => {
//   return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//           const base64String = reader.result as string;
//           const base64Data = base64String.split(',')[1];
//           resolve(base64Data);
//       };
//       reader.onerror = () => {
//           reject(null);
//       };
//       reader.readAsDataURL(file);
//   });
// };

export const getBase64FromPdf = async (file: File): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const arrayBuffer = reader.result as ArrayBuffer; 
      const byteNumbers = new Uint8Array(arrayBuffer);
      const byteString = byteNumbers.reduce((data, byte) => data + String.fromCharCode(byte), ''); 
      const base64String = btoa(byteString); 
      resolve(base64String);
    };
    reader.onerror = () => {
      reject(null);
    };
    reader.readAsArrayBuffer(file); 
  });
};

export const base64ToFile = (base64: string, filename: string): File => {
  const byteCharacters = atob(base64); 
  const byteNumbers = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i); 
  }
  const blob = new Blob([byteNumbers], { type: 'application/pdf' }); 
  return new File([blob], filename, { type: 'application/pdf' });
};

export const formatDatePost = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }
  return date.toISOString();
}