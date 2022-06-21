export default function cssToReact(style = "") {
  let arrStyle = style.trim().split(";");
  let arrProps = arrStyle.map((style) => style.trim().split(":"));
  let styles = {};
  arrProps.forEach((prop) => {
    var key = prop[0],
      value = prop[1];
    styles[key] = value;
  });
  return JSON.stringify(style);
}
