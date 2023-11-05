import { createSlice, nanoid } from '@reduxjs/toolkit';

/** @type {{ id: string; message: string; type: string; href: string }[]} */
const initialState = [];

const notification = createSlice({
	name: 'notification',
	initialState,
	reducers: {
		addNotification(state, { payload }) {
			payload.id = nanoid();
			state.push(payload);
		},
		removeNotification(state, { payload }) {
			return state.filter((item) => item.id !== payload);
		}
	}
});

export const { addNotification, removeNotification } = notification.actions;
export default notification.reducer;
