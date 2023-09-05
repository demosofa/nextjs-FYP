import { createSlice } from '@reduxjs/toolkit';

/** @type {{title:string, content:string, url:string, data:object}}*/
const initialState = {};

const modal = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		showModal(state, { payload }) {
			return payload;
		},
		closeModal() {
			return initialState;
		}
	}
});

export const { showModal, closeModal } = modal.actions;
export default modal.reducer;
