import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';
import {
	DependencyList,
	Dispatch,
	SetStateAction,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';

export type AxiosLoadCallback = (
	AxiosInstance: AxiosInstance,
	setLoading: Dispatch<SetStateAction<boolean>>
) => unknown;

export default function useAxiosLoad({
	config,
	callback,
	deps = [],
	setError
}: {
	config?: CreateAxiosDefaults;
	callback: AxiosLoadCallback;
	deps: DependencyList;
	setError?: (error: Error) => unknown;
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
				await callback(axiosInstance, setLoading);

				setLoading(false);
			} catch (err) {
				setError?.(err);
			}
		};

		loadingData();

		return () => controller.current?.abort();
	}, deps);

	return { loading, axiosInstance, controller };
}
