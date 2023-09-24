import { currencyFormat } from '@shared';

import styles from './_priceInfo.module.scss';

export default function PriceInfo({ discount, price }) {
	return (
		<div className='flex items-center gap-3'>
			<span className='text-3xl font-medium text-red-500'>
				{currencyFormat(price)}
			</span>
			{discount ? (
				<>
					<span className='text-base text-gray-600 line-through'>
						{currencyFormat(discount)}
					</span>
					<div className={styles.discount_label}>
						<span>-{Math.ceil(100 - (price / discount) * 100)}%</span>
					</div>
				</>
			) : null}
		</div>
	);
}
