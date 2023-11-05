import { createSlice, nanoid } from '@reduxjs/toolkit';

/** @type {{ id: string; name: string; options: string[] }[]} */
export const initialState = [];

const variant = createSlice({
	initialState,
	name: 'variant',
	reducers: {
		addVariant(state) {
			const unique = { ...initialState.concat()[0] };
			unique.id = nanoid();

			return [...state, unique];
		},
		editVariant(state, { payload }) {
			const { index, ...props } = payload;
			state[index] = { ...state[index], ...props };
		},
		deleteVariant(state, { payload }) {
			return state.filter((_, index) => index !== payload);
		},
		deleteAllVariant() {
			return [];
		}
	}
});

export default variant.reducer;
export const { addVariant, editVariant, deleteVariant, deleteAllVariant } =
	variant.actions;
