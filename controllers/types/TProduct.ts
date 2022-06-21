type TProduct = {
  id: string,
  title: string,
  description: string,
  status: string,
  thumbnail: File,
  variants: object[],
  tags: string[],
  files: Array<File>,
  price: number,
  quantity: number
}

export default TProduct