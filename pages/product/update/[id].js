import { useState } from "react";
import { Container, Form } from "../../../components";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export async function getServerSideProps({ params }) {
  const response = await fetch(`${LocalApi}/productcrud/${params.id}`);
  const product = await response.json()._doc;
  return {
    props: {
      product,
    },
  };
}

export default function UpdateForm({ product }) {
  const [edit, setEdit] = useState(product);
  return (
    <Form>
      <Form.Title>Update {product.title}</Form.Title>
      <Container>
        <Form.Item>
          <Form.Title>Price</Form.Title>
          <Form.Input
            value={edit.price}
            onClick={(e) =>
              setEdit((prev) => ({ ...prev, price: e.target.value }))
            }
          ></Form.Input>
        </Form.Item>
        <Form.Item>
          <Form.Title>Quantity</Form.Title>
          <Form.Input
            value={edit.quantity}
            onClick={(e) =>
              setEdit((prev) => ({ ...prev, quantity: e.target.value }))
            }
          ></Form.Input>
        </Form.Item>
      </Container>
      <Container>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Thumbnail</th>
              <th>Sku</th>
              <td>Type</td>
              <th>price</th>
              <th>quantity</th>
            </tr>
          </thead>
          <tbody>
            {edit.variations.map((variation, index) => {
              return (
                <tr>
                  <td>{index}</td>
                  <td>v{variation.thumbnail}</td>
                  <td>{variation.sku}</td>
                  <td>{variation.type.join("/")}</td>
                  <td>{variation.price}</td>
                  <td>{variation.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Container>
    </Form>
  );
}
