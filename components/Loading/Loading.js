import styles from "./_loading.module.scss";

export default function Loading({ className, ...props }) {
  return (
    <div {...props}>
      <div className={styles.load_rotate + ` ${className}`}></div>
    </div>
  );
}

Loading.Text = function LoadingText({
  text = "loading...",
  className,
  ...props
}) {
  return (
    <div className={styles.letter - holder + ` ${className}`} {...props}>
      {[...text].map((char, index) => (
        <div
          key={index}
          className={styles.letter}
          style={{ "--value": index * 0.12 + 0.48 + "s" }}
        >
          {char}
        </div>
      ))}
    </div>
  );
};
