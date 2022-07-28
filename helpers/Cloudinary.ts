import { v2 as cloudinary, UploadApiOptions, AdminApiOptions, ArchiveApiOptions, ConfigAndUrlOptions, AdminAndResourceOptions } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

interface RootApiOptions extends AdminApiOptions{
  root_folder?: string
}

export default class Cloudinary{
  public static v2 = cloudinary;
  static listFolders(options?: RootApiOptions){
    const {root_folder, ...others} = options
    if(!root_folder)
      return new Promise((resolve, reject) => {
        cloudinary.api.root_folders((err, result) =>{
          if(err) reject(err);
          resolve(result)
        }, others)
      })
    else return cloudinary.api.sub_folders(root_folder, others)
  }
  static listResources(options?: AdminAndResourceOptions){
    return cloudinary.api.resources(options)
  }
  static createFolder(path: string, options?: AdminApiOptions){
    return cloudinary.api.create_folder(path, options)
  }
  static deleteFolder(path: string, options?: AdminApiOptions){
    return cloudinary.api.delete_folder(path, options)
  }
  static uploadFile (files: string, option?: UploadApiOptions){
    return cloudinary.uploader.upload(files, option);
  }
  static destroyFile (public_id: string, options?: { resource_type?: string; type?: string; invalidate?: boolean; }){
    return cloudinary.uploader.destroy(public_id, options)
  }
  static downloadZipUrl (options?: ArchiveApiOptions | ConfigAndUrlOptions) {
    return cloudinary.utils.download_zip_url(options);
  }
}