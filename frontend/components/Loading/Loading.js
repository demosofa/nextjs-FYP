import styles from "./_loading.module.scss";

export default function Loading({ className, ...props }) {
  return (
    <div {...props}>
      <div className={styles.rotate + ` ${className}`} />
    </div>
  );
}

Loading.Spinner = function LoadingSpinner({ className, ...props }) {
  return (
    <div className={className}>
      <div className={styles.spinner} {...props}>
        <div className={`${styles.circle} ${styles.one}`}></div>
        <div className={`${styles.circle} ${styles.two}`}></div>
        <div className={`${styles.circle} ${styles.three}`}></div>
      </div>
    </div>
  );
};

Loading.Text = function LoadingText({
  text = "loading...",
  className,
  ...props
}) {
  return (
    <div className={styles.letter_holder + ` ${className}`} {...props}>
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

Loading.Dots = function LoadingDots({ className, ...props }) {
  return (
    <div className={className} {...props}>
      <div className={styles.filter}>
        <div className={styles.dot_shuttle} />
      </div>
    </div>
  );
};
