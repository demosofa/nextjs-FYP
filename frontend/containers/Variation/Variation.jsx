import { useVariantPermutation } from '@hooks';
import { useEffect, useMemo } from 'react';
import { GiTrashCan } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';

import {
	addVariation,
	deleteVariation,
	editVariation
} from '@redux/reducer/variationSlice';

export default function Variation() {
	const variants = useSelector((state) => state.variant);
	const dispatch = useDispatch();

	const arrVariant = useMemo(
		() => variants.reduce((prev, curr) => [...prev, curr.options], []),
		[variants]
	);
	const list = useVariantPermutation(arrVariant);
	const variations = useSelector((state) => state.variation);

	useEffect(() => {
		dispatch(addVariation(list));
	}, [dispatch, list]);

	return (
		<div style={{ padding: '5px', overflowX: 'auto' }}>
			<table className='table'>
				<thead>
					<tr>
						<th>No.</th>
						<th>Type</th>
						<th>Pricing</th>
						<th>Quantity</th>
						<th>Size Package</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					{variations?.length ? (
						variations.map((variation, index) => {
							if (!variation.types.length) return undefined;
							return (
								<tr key={index}>
									<td>
										<label>No.</label>
										{index + 1}
									</td>
									<td>
										<label>Type</label>
										{variation.types.join('/')}
									</td>
									<td>
										<label>Pricing</label>
										<dl>
											<dt>Price</dt>
											<dd>
												<input
													value={variation.price}
													onChange={(e) =>
														dispatch(
															editVariation({ index, price: e.target.value })
														)
													}
												/>
											</dd>
											<dt>Cost</dt>
											<dd>
												<input
													value={variation.cost}
													onChange={(e) =>
														dispatch(
															editVariation({ index, cost: e.target.value })
														)
													}
												/>
											</dd>
										</dl>
									</td>
									<td>
										<label>Quantity</label>
										<input
											value={variation.quantity}
											onChange={(e) =>
												dispatch(
													editVariation({ index, quantity: e.target.value })
												)
											}
										/>
									</td>
									<td>
										<label>Package size</label>
										<dl>
											<dt>Length</dt>
											<dd>
												<input
													value={variation.length}
													onChange={(e) =>
														dispatch(
															editVariation({ index, length: e.target.value })
														)
													}
												/>
											</dd>

											<dt>Width</dt>
											<dd>
												<input
													value={variation.width}
													onChange={(e) =>
														dispatch(
															editVariation({ index, width: e.target.value })
														)
													}
												/>
											</dd>

											<dt>Height</dt>
											<dd>
												<input
													value={variation.height}
													onChange={(e) =>
														dispatch(
															editVariation({ index, height: e.target.value })
														)
													}
												/>
											</dd>
										</dl>
									</td>
									<td
										className='text-center'
										onClick={() => dispatch(deleteVariation(index))}
									>
										<GiTrashCan />
									</td>
								</tr>
							);
						})
					) : (
						<tr>
							<td colSpan='6' className='text-center'>
								Please add variants first so variation can be generated
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
