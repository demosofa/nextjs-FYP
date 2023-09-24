import { Cloudinary, parseForm } from '@helpers';
import { UploadApiOptions } from 'cloudinary';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
	api: {
		bodyParser: false
	}
};

async function upload(req: NextApiRequest, res: NextApiResponse) {
	try {
		const result = await parseForm(req);
		let { path, public_id } = result.fields;
		const file = result.files[Object.keys(result.files)[0]][0];
		const folder = await Cloudinary.createFolder(`CMS/${path}`);
		let options: UploadApiOptions = {
			folder: folder.path,
			unique_filename: true
		};
		if (public_id && public_id.length) {
			const publicId = public_id[0].replace(folder.path + '/', '');
			options = { ...options, public_id: publicId, invalidate: true };
		}
		const uploaded = await Cloudinary.uploadFile(file.filepath, options);
		res.status(200).json(uploaded);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

export default upload;
