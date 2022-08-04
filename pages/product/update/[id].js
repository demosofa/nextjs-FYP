import { useRouter } from "next/router";
import { useState } from "react";
import { Container } from "../../../components";
import { UpdateImage, UpdateVariation } from "../../../containers";
import styles from "../../../styles/Home.module.scss";

export default function UpdateProduct() {
  const [toggle, setToggle] = useState(null);
  const router = useRouter();
  return (
    <Container>
      <div className={styles.card} onClick={() => setToggle("image")}>
        Update Product Image
      </div>
      <div className={styles.card} onClick={() => setToggle("variation")}>
        Update Product Variation
      </div>
      {(toggle !== null && toggle === "image" && (
        <UpdateImage productId={router.query?.id} />
      )) ||
        (toggle === "variation" && (
          <UpdateVariation productId={router.query?.id} />
        ))}
    </Container>
  );
}
