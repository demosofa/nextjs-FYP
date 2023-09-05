import { createSlice } from '@reduxjs/toolkit';

/** @type {{ types: string[], price: number, cost: number, quantity: number, length:number, width:number, height:number }[]} */
const initialState = [];

const variation = createSlice({
	initialState,
	name: 'variation',
	reducers: {
		addVariation(state, { payload }) {
			return payload.map((variant) => ({
				types: variant,
				price: 0,
				cost: 0,
				length: 0,
				width: 0,
				height: 0,
				quantity: 0
			}));
		},
		editVariation(state, { payload }) {
			const { index, ...props } = payload;
			state[index] = { ...state[index], ...props };
		},
		editAllVariations(state, { payload }) {
			return state.map((item) => ({ ...item, ...payload }));
		},
		deleteVariation(state, { payload }) {
			return state.filter((_, index) => index !== payload);
		}
	}
});

export default variation.reducer;
export const {
	addVariation,
	editVariation,
	editAllVariations,
	deleteVariation
} = variation.actions;
