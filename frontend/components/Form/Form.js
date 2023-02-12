import { forwardRef, useState } from "react";
import { RiEye2Line, RiEyeCloseLine } from "react-icons/ri";
import Icon from "../Icon/Icon";
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

Form.Item = function FormItem({ children, ...restProp }) {
  return (
    <div className={styles.form__item} {...restProp}>
      {children}
    </div>
  );
};

Form.Title = function FormTitle({ children, className, ...restProp }) {
  return (
    <label className={`${styles.form__title} ${className}`} {...restProp}>
      {children}
    </label>
  );
};

Form.Logo = function FormLogo({ image, alt, ...restProp }) {
  return (
    <div className={styles.form__logo} {...restProp}>
      <img src={image} alt={alt} className="form__image" />
    </div>
  );
};

Form.Input = forwardRef(function FormInput({ children, ...restProp }, ref) {
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

Form.Password = forwardRef(function FormPassword(
  { children, ...restProp },
  ref
) {
  const [show, setShow] = useState(false);
  return (
    <>
      <div className={styles.form__input} style={{ display: "flex" }}>
        <input
          className={styles.form__password}
          type={show ? "text" : "password"}
          {...restProp}
          onCopy={(e) => e.preventDefault()}
        />
        <Icon onClick={() => setShow(!show)} style={{ marginRight: "10px" }}>
          {show ? <RiEye2Line /> : <RiEyeCloseLine />}
        </Icon>
      </div>
      {children}
    </>
  );
});

Form.Submit = function FormSubmit({ children, ...props }) {
  return (
    <button className={styles.form__button} type="submit" {...props}>
      {children}
    </button>
  );
};

Form.Button = function FormButton({ children, ...restProp }) {
  return (
    <a className={styles.form__button} {...restProp}>
      {children}
    </a>
  );
};

Form.TextArea = function FormTextArea({ children, ...restProp }) {
  return (
    <textarea
      cols="60"
      rows="15"
      className="block w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
      {...restProp}
    ></textarea>
  );
};

Form.Select = function FormSelect({ children, ...restProp }) {
  return (
    <select className={styles.form__select} {...restProp}>
      {children}
    </select>
  );
};

Form.Option = function FormOption({ children, ...props }) {
  return (
    <option {...props} className={styles.form__option}>
      {children}
    </option>
  );
};

Form.Link = function FormLink({ children, ...restProp }) {
  return (
    <a href="" className={styles.form__link} {...restProp}>
      {children}
    </a>
  );
};

// Form.Message = function FormMessage({ children, ...restProps }) {
//   return (
//     <p className={styles.form__message} {...restProps}>
//       {children}
//     </p>
//   );
// };

// Form.ErrorMessage = function FormError({ children, ...restProp }) {
//   return (
//     <p className={styles.form__errorMsg} {...restProp}>
//       {children}{" "}
//     </p>
//   );
// };

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
