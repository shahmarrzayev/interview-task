import { EConfig } from './config.enum';
import { AES, enc } from 'crypto-js';

export const getConfig = (config: EConfig): any => {
  if (!config) return null;

  return process.env[config];
};

export const encrypt = (text: string): string => {
  const encryptedText = AES.encrypt(text, getConfig(EConfig.ENCRYPTION_PASSWORD));
  return encryptedText.toString();
};

export const decrypt = (encryptedText: string): string => {
  const decryptedText = AES.decrypt(encryptedText, getConfig(EConfig.ENCRYPTION_PASSWORD));
  return decryptedText.toString(enc.Utf8);
};
