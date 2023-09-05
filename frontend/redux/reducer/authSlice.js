import { createSlice } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';
import { authApi } from '../api/authApi';

const initialState = { accountId: null, username: null, role: null };

const authSlice = createSlice({
	name: 'auth',
	initialState,
	extraReducers: (builder) => {
		builder
			.addMatcher(
				authApi.endpoints.login.matchFulfilled,
				(state, { payload }) => {
					const { role, username, accountId } = jwtDecode(payload);
					state.accountId = accountId;
					state.username = username;
					state.role = role;
				}
			)
			.addMatcher(
				authApi.endpoints.register.matchFulfilled,
				(state, { payload }) => {
					const { role, username, accountId } = jwtDecode(payload);
					state.accountId = accountId;
					state.username = username;
					state.role = role;
				}
			);
	}
});

export default authSlice.reducer;
