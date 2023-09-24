import { SignOptions, VerifyOptions, sign, verify } from 'jsonwebtoken';

export default class Token {
	accessToken: string;
	refreshToken: string;
	constructor(payload: string | object | Buffer) {
		this.accessToken = sign(payload, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: '5m'
		});
		this.refreshToken = sign(payload, process.env.REFRESH_TOKEN_SECRET, {
			expiresIn: '1d'
		});
	}
	static signToken(
		payload: string | object | Buffer,
		secret = '',
		options: SignOptions
	) {
		return sign(payload, process.env.SECRET_KEY + secret, options);
	}
	static verifyToken(
		token: string,
		secret = '',
		options: VerifyOptions & {
			complete: true;
		} = null
	) {
		return verify(token, process.env.SECRET_KEY + secret, options);
	}
	static verifyAccessToken(token: string) {
		return verify(token, process.env.ACCESS_TOKEN_SECRET);
	}
	static verifyRefreshToken(token: string) {
		return verify(token, process.env.REFRESH_TOKEN_SECRET);
	}
}
