import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, utf8ToBytes } from '@noble/hashes/utils.js';
import { storage } from '@/services/storage/local-storage';

type StoredPin = { salt: string; hash: string };
function key(parentId: string) { return `nash2.parent-pin.${parentId}`; }
async function hashPin(pin: string, salt: string) { return bytesToHex(sha256(utf8ToBytes(`${salt}:${pin}`))); }
function createSalt() { return Array.from(Crypto.getRandomBytes(16), (byte) => byte.toString(16).padStart(2, '0')).join(''); }
async function getStored(parentId: string) { return Platform.OS === 'web' ? storage.get<string>(key(parentId)) : SecureStore.getItemAsync(key(parentId)); }
async function setStored(parentId: string, value: string) { if (Platform.OS === 'web') storage.set(key(parentId), value); else await SecureStore.setItemAsync(key(parentId), value); }

export const parentPinService = {
  async hasPin(parentId: string) { return Boolean(await getStored(parentId)); },
  async create(parentId: string, pin: string) { const salt = createSalt(); const value: StoredPin = { salt, hash: await hashPin(pin, salt) }; await setStored(parentId, JSON.stringify(value)); },
  async verify(parentId: string, pin: string) { const raw = await getStored(parentId); if (!raw) return false; const value = JSON.parse(raw) as StoredPin; return (await hashPin(pin, value.salt)) === value.hash; },
  async change(parentId: string, currentPin: string, nextPin: string) { if (!(await this.verify(parentId, currentPin))) return false; await this.create(parentId, nextPin); return true; },
  async resetAfterAuthentication(parentId: string, nextPin: string) { await this.create(parentId, nextPin); },
};
