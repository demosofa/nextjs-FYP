import React from "react";
import styles from "./_container.module.scss";

// 1. define the default component
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

ContainerComponent.Absolute = function ({ children, ...restProps }) {
  return (
    <div {...restProps} className={styles.container__absolute}>
      {children}
    </div>
  );
};
ContainerComponent.Flex = function ({
  children,
  className,
  justify = "none",
  align = "none",
  style,
  ...restProps
}) {
  return (
    <div
      {...restProps}
      style={{ justifyContent: justify, alignItems: align, ...style }}
      className={`${styles.container__flex} ${className}`}
    >
      {children}
    </div>
  );
};

ContainerComponent.Grid = function ({ children, columns = 3, ...restProps }) {
  return (
    <div className={styles.container__grid} {...restProps}>
      {children}
    </div>
  );
};

ContainerComponent.GridThreeColumns = function ({ children, ...props }) {
  return (
    <div className={styles.container__gridThreeColumns} {...props}>
      {children}
    </div>
  );
};

ContainerComponent.BackDrop = function ({ children, ...restProps }) {
  return (
    <div className="backdrop" {...restProps}>
      {children}
    </div>
  );
};

ContainerComponent.Item = function ({
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

ContainerComponent.Pane = function ({ children, ...restProps }) {
  return (
    <div className={styles.container__pane} {...restProps}>
      {children}
    </div>
  );
};
ContainerComponent.Toggle = function ({ children, ...restProps }) {
  return <div {...restProps}>{children}</div>;
};
ContainerComponent.Inner = function ({ children, ...restProps }) {
  return (
    <div className={styles.container__inner} {...restProps}>
      {children}
    </div>
  );
};

ContainerComponent.MiddleInner = function ({ children, ...restProps }) {
  return (
    <div className={styles.container__middleInner} {...restProps}>
      {children}
    </div>
  );
};

ContainerComponent.Link = function ({ children, ...restProps }) {
  return (
    <a className={styles.container__link} href={restProps.path}>
      {children}
    </a>
  );
};

ContainerComponent.Section = function ({ children, forwardRef, ...restProps }) {
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
ContainerComponent.Hero = React.forwardRef(function (
  { children, ...restProps },
  ref
) {
  return (
    <div className={styles.container__hero} ref={ref} {...restProps}>
      {children}
    </div>
  );
});
ContainerComponent.InlineGroup = function ({ children, ...props }) {
  return (
    <div {...props} className={styles.container__inlineGroup}>
      {children}
    </div>
  );
};
