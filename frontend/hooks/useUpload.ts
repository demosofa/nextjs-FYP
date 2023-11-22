import { useCallback, useEffect, useRef, useState } from 'react';

export default function useUpload({
	init = [],
	limit = {
		size: 5,
		total: 10
	},
	callback
}: {
	init?: File[];
	limit?: { size: number; total: number };
	callback?: (Files: File[], Previews: (string | ArrayBuffer)[]) => unknown;
}) {
	const [files, setFiles] = useState<Array<File>>(init);
	const run = useRef(true);
	const [previews, setPreviews] = useState([]);
	const [loading, setLoading] = useState(false);

	const isOverSize = useCallback(
		(currentFiles: File[], newFile: File) => {
			const maxMB = limit.size * 1024 * 1024;
			const futureSize = currentFiles.reduce(
				(prev, curr) => prev + curr.size,
				newFile.size
			);

			if (maxMB >= futureSize) return false;
			return true;
		},
		[limit]
	);

	const isExist = (currentFiles: File[], newFile: File) => {
		const index = currentFiles.findIndex((file) => file.name === newFile.name);

		if (index === -1) return false;
		return true;
	};

	const getFiles = useCallback(
		(newFiles: FileList, overwriteStartAt?: number) => {
			const length = Math.min(limit.total - files.length, newFiles.length);

			setFiles((prev) => {
				let currentFiles =
					typeof overwriteStartAt == 'number'
						? prev.filter((_, i) => i < overwriteStartAt)
						: prev;

				for (let i = 0; i < length; i++) {
					const newFile = newFiles[i];
					if (
						!isOverSize(currentFiles, newFile) &&
						!isExist(currentFiles, newFile)
					)
						currentFiles = [...currentFiles, newFile];
				}

				return currentFiles;
			});
		},
		[files.length, limit.total, isOverSize]
	);

	const handleDelete = useCallback((index?: number, e?: MouseEvent) => {
		e?.stopPropagation();

		run.current = false;

		if (index !== undefined) {
			setFiles((prev) => prev.filter((_, i) => i !== index));
			setPreviews((prev) => prev.filter((_, i) => i !== index));
		} else {
			setFiles([]);
			setPreviews([]);
		}
	}, []);

	const handleOpenPreview = useCallback(
		(index: number, e?: MouseEvent) => {
			e?.stopPropagation();

			if (e.detail > 1) {
				const popup = window.open('', files[index].name);
				popup.document.write(
					`<iframe src="${previews[index]}" frameborder="0" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"/>`
				);
				popup.document.close();
			}
		},
		[files, previews]
	);

	const handleFile = (file: File) => {
		return new Promise<string | ArrayBuffer>((resolve, reject) => {
			const fr = new FileReader();
			fr.readAsDataURL(file);
			fr.onload = () => {
				resolve(fr.result);
			};
			fr.onerror = () => {
				reject(fr.onerror);
			};
		});
	};

	useEffect(() => {
		setLoading(true);
		Promise.all(files.map((item) => handleFile(item)))
			.then(async (previewsResult) => {
				if (run.current) setPreviews(previewsResult);
				if (previewsResult.length) await callback(files, previewsResult);
			})
			.then(() => (run.current = true))
			.then(() => setLoading(false));
	}, [files, callback]);

	return {
		loading,
		files,
		previews,
		getFiles,
		handleDelete,
		handleOpenPreview
	};
}
