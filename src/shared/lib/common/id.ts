import { customAlphabet } from 'nanoid';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

export const generateId = customAlphabet(ALPHABET, 6);
