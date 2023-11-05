import { createSlice } from '@reduxjs/toolkit';

/**
 * @type {{
 * 	_id: string;
 * 	productId: string;
 * 	title: string;
 * 	thumbnail: string;
 * 	price: number;
 * 	compare: number;
 * 	avgRating: number;
 * 	sold: number;
 * }[]}
 */
const initialState = [];

const recentlyViewed = createSlice({
	initialState,
	name: 'recentlyViewed',
	reducers: {
		addViewed(state, { payload }) {
			const index = state.findIndex((item) => item._id === payload._id);

			if (index === -1) {
				if (state.length >= 10) state.shift();
				state.push(payload);
			} else {
				state[index] = payload;
			}
		},
		removeAll() {
			localStorage.removeItem('recentlyViewed');
			return initialState;
		}
	}
});

export const { addViewed, removeAll } = recentlyViewed.actions;
export default recentlyViewed.reducer;
