type TProduct = {
  id: string,
  title: string,
  description: string,
  status: string,
  thumbnail: File,
  tags: string[],
  files: Array<File>,
  price: number,
  quantity: number
}

export default TProduct