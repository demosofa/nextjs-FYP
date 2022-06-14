export default function cssToReact(style = "") {
  let arrStyle = style.trim().split(";");
  let arrProps = arrStyle.map((style) => style.trim().split(":"));
}
