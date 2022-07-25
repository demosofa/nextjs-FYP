import { v2 as cloudinary, UploadApiOptions, AdminApiOptions, ArchiveApiOptions, ConfigAndUrlOptions, AdminAndResourceOptions } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

export default class Cloudinary{
  public static v2 = cloudinary;
  static listFolders(root_folder?: string,options?: AdminApiOptions){
    if(!root_folder)
      return new Promise((resolve, reject) => {
        cloudinary.api.root_folders((err, result) =>{
          if(err) reject(err);
          resolve(result)
        }, options)
      })
    else return cloudinary.api.sub_folders(root_folder, options)
  }
  static listResources(options?: AdminAndResourceOptions){
    return cloudinary.api.resources(options)
  }
  static async createFolder(path: string, options?: AdminApiOptions){
    const result: any = await this.listFolders();
    const index = result.folders.findIndex((folder) => folder.path === path);
    if(index !== -1) return result.folders[index]
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
  static createZip(options?: ArchiveApiOptions){
    return cloudinary.uploader.create_zip(options)
  }
  static downloadZip (options?: ArchiveApiOptions | ConfigAndUrlOptions) {
    return cloudinary.utils.download_zip_url(options);
  }
}