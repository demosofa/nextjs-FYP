import styles from "./Avatar.module.css";

export default function Avatar({ size, src, text = null, isOnline = null }) {
  return (
    <div className={styles.AvatarContainer}>
      <div className={styles.AvatarImgContainer}>
        <img
          className={styles.AvatarImg}
          alt="Avatar"
          style={{ width: size, height: size }}
          src={src}
        />
        {isOnline == null ? null : (
          <div
            className={
              isOnline ? styles.AvatarOnlineBadge : styles.AvatarOfflineBadge
            }
          />
        )}
      </div>
      {text && <span className={styles.AvatarName}>{text}</span>}
    </div>
  );
}
