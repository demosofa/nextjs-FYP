import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';
import { DependencyList, useEffect, useMemo, useRef, useState } from 'react';

export default function useAxiosLoad({
	config,
	callback,
	deps = [],
	setError
}: {
	config?: CreateAxiosDefaults;
	callback: (AxiosInstance: AxiosInstance) => unknown;
	deps: DependencyList;
	setError?: Function;
}) {
	const controller = useRef<AbortController>(null);
	const axiosInstance = useMemo(() => axios.create(config), [config]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadingData = async () => {
			controller.current = new AbortController();

			try {
				setLoading(true);

				axiosInstance.defaults.signal = controller.current.signal;
				await callback(axiosInstance);

				setLoading(false);
			} catch (err) {
				setError && setError(err);
			}
		};

		loadingData();

		return () => controller.current?.abort();
	}, [deps, axiosInstance, callback, setError]);

	return { loading, axiosInstance, setLoading, controller };
}
