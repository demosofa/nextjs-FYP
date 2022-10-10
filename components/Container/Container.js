import React from "react";
import styles from "./_container.module.scss";

export default function ContainerComponent({ children, ...restProps }) {
  return (
    <div
      {...restProps}
      className={`${restProps.className || ""} ${styles.container__root}`}
    >
      {children}
    </div>
  );
}

ContainerComponent.BackDrop = function ContainerBackDrop({
  children,
  ...restProps
}) {
  return (
    <div className="backdrop" {...restProps}>
      {children}
    </div>
  );
};

ContainerComponent.Item = function ContainerItem({
  children,
  width = "100%",
  padding = "5px",
  ...restProps
}) {
  return (
    <div
      className={styles.container__item}
      width={width}
      padding={padding}
      {...restProps}
    >
      {children}
    </div>
  );
};

ContainerComponent.Pane = function ContainerPane({ children, ...restProps }) {
  return (
    <div className={styles.container__pane} {...restProps}>
      {children}
    </div>
  );
};
ContainerComponent.Toggle = function ContainerToggle({
  children,
  ...restProps
}) {
  return <div {...restProps}>{children}</div>;
};
ContainerComponent.Inner = function ContainerInner({ children, ...restProps }) {
  return (
    <div className={styles.container__inner} {...restProps}>
      {children}
    </div>
  );
};

ContainerComponent.MiddleInner = function ContainerMiddleInner({
  children,
  ...restProps
}) {
  return (
    <div className={styles.container__middleInner} {...restProps}>
      {children}
    </div>
  );
};

ContainerComponent.Link = function ContainerLink({ children, ...restProps }) {
  return (
    <a className={styles.container__link} href={restProps.path}>
      {children}
    </a>
  );
};

ContainerComponent.Section = function ContainerSection({
  children,
  forwardRef,
  ...restProps
}) {
  return (
    <div
      {...restProps}
      ref={forwardRef}
      className={`${styles.container__section} ${restProps.className}`}
    >
      {children}
    </div>
  );
};
ContainerComponent.Hero = React.forwardRef(function ContainerHero(
  { children, ...restProps },
  ref
) {
  return (
    <div className={styles.container__hero} ref={ref} {...restProps}>
      {children}
    </div>
  );
});
ContainerComponent.InlineGroup = function ContainerInlineGroup({
  children,
  ...props
}) {
  return (
    <div {...props} className={styles.container__inlineGroup}>
      {children}
    </div>
  );
};
