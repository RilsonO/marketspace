import { UserDTO } from '@dtos/UserDTO';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_STORAGE } from '@storage/storageConfig';

export async function storageUserSave(user: UserDTO) {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
}

export async function storageUserGet() {
  const storage = await AsyncStorage.getItem(USER_STORAGE);

  const user: UserDTO = storage ? JSON.parse(storage) : ({} as UserDTO);

  return user;
}

export async function storageUserRemove() {
  await AsyncStorage.removeItem(USER_STORAGE);
}
