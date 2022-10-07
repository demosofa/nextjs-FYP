import { useRouter } from "next/router";

export default function Success() {
  const router = useRouter();
  return (
    <div>
      <span>Success checkout Order</span>
    </div>
  );
}
