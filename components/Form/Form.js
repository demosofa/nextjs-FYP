import { forwardRef } from "react";
import styles from "./_form.module.scss";

export default function Form({
  children,
  action,
  method,
  onSubmit,
  className,
  ...restProp
}) {
  return (
    <form
      className={styles.form + ` ${className}`}
      action={action}
      method={method}
      onSubmit={onSubmit}
      encType={restProp.encType}
      {...restProp}
    >
      {children}
    </form>
  );
}

Form.Item = function ({ children, ...restProp }) {
  return (
    <div className={styles.form__item} {...restProp}>
      {children}
    </div>
  );
};

Form.Title = function ({ children, ...restProp }) {
  return (
    <label className={styles.form__title} {...restProp}>
      {children}
    </label>
  );
};

Form.Logo = function ({ image, alt, ...restProp }) {
  return (
    <div className={styles.form__logo} {...restProp}>
      <img src={image} alt={alt} className="form__image" />
    </div>
  );
};

Form.Input = forwardRef(function ({ children, ...restProp }, ref) {
  return (
    <>
      {restProp.component}
      <input
        className={styles.form__input}
        type={restProp.component ? "hidden" : restProp.type}
        ref={ref}
        {...restProp}
      />
    </>
  );
});

Form.Submit = function ({ children, ...props }) {
  return (
    <button className={styles.form__button} type="submit" {...props}>
      {children}
    </button>
  );
};

Form.Link = function ({ children, ...restProp }) {
  return (
    <a href="" className={styles.form__link} {...restProp}>
      {children}
    </a>
  );
};

Form.Button = function ({ children, ...restProp }) {
  return (
    <a className={styles.form__button} {...restProp}>
      {children}
    </a>
  );
};
Form.Message = function ({ children, ...restProps }) {
  return (
    <p className={styles.form__message} {...restProps}>
      {children}
    </p>
  );
};

Form.ErrorMessage = function ({ children, ...restProp }) {
  return (
    <p className={styles.form__errorMsg} {...restProp}>
      {children}{" "}
    </p>
  );
};

Form.TextArea = function ({ children, ...restProp }) {
  return <textarea className={styles.form__textarea} {...restProp}></textarea>;
};

Form.Select = function ({ children, ...restProp }) {
  return (
    <select className={styles.form__select} {...restProp}>
      {children}
    </select>
  );
};

Form.Option = function ({ children, ...props }) {
  return (
    <option {...props} className={styles.form__option} value={props.value}>
      {children}
    </option>
  );
};

// Form.Checkbox = forwardRef(function ({ children, ...restProp }, ref) {
//   return (
//     <input type={"checkbox"} className="form__checkbox" ref={ref} {...restProp}>
//       {children}
//     </input>
//   );
// });

// Form.FrameAvatar = function ({ children, ...restProp }) {
//   return (
//     <div className="form__frameAvatar" {...restProp}>
//       {children}
//     </div>
//   );
// };
