import { hash, verify } from 'argon2';

export class HashLib {
	static async hash(password: string): Promise<string> {
		return hash(password);
	}

	static async verify(password: string, hash: string): Promise<boolean> {
		return verify(hash, password);
	}
}
