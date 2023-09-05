import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { expireStorage } from '@utils/index';
import { addCart, removeCart } from '../reducer/cartSlice';
import { RootState } from '../store';

const cartListenerMiddleware = createListenerMiddleware();
cartListenerMiddleware.startListening({
	matcher: isAnyOf(addCart, removeCart),
	effect: async (action, listenerApi) => {
		const cartState = (<RootState>listenerApi.getState()).cart;
		expireStorage.setItem('cart', cartState, '5m');
	}
});

export default cartListenerMiddleware;
