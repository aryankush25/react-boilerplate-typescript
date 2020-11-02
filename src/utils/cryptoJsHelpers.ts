import CryptoJS from 'crypto-js';

const passphrase = process.env.REACT_APP_PASSPHRASE || '123';

export const encryptWithAES = (text: string) => {
  return CryptoJS.AES.encrypt(text, passphrase).toString();
};

export const decryptWithAES = (text: string) => {
  let originalText = '';

  try {
    const bytes = CryptoJS.AES.decrypt(text, passphrase);

    originalText = bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    originalText = '';
  }

  return originalText;
};
