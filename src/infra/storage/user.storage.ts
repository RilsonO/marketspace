import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_STORAGE } from './config.storage';
import { BaseUserModel } from '../../entities/User';

export async function storageUserSave(user: BaseUserModel) {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
}

export async function storageUserGet() {
  const storage = await AsyncStorage.getItem(USER_STORAGE);

  const user: BaseUserModel = storage
    ? JSON.parse(storage)
    : ({} as BaseUserModel);

  return user;
}

export async function storageUserRemove() {
  await AsyncStorage.removeItem(USER_STORAGE);
}
