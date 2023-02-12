import { useDispatch, useSelector } from "react-redux";
import { fetcher } from "../../contexts/SWRContext";
import { closeModal } from "../../redux/reducer/modalSlice";
import { addNotification } from "../../redux/reducer/notificationSlice";

export default function Modal({ channel, url }) {
  const modal = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const handleOk = async (e) => {
    e.stopPropagation();
    try {
      await fetcher({ url: modal.url, method: "patch", data: modal.data });
      channel.publish({
        name: "shipping",
        data: {
          message: "Success paid order",
          type: "success",
        },
      });
    } catch (error) {
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
    dispatch(closeModal());
  };
  const handleCancel = (e) => {
    e.stopPropagation();
    dispatch(closeModal());
  };
  if (!modal.content && !modal.title && url !== modal.url) return;
  return (
    <>
      <div className="backdrop" onClick={() => dispatch(closeModal())} />
      <div className="form_center">
        <label>{modal.title}</label>
        <p>{modal.content}</p>
        <div className="flex gap-3">
          <button
            className="transform rounded border border-blue-600 bg-transparent py-2 px-4 font-semibold text-blue-600 transition duration-200 ease-in hover:-translate-y-1 hover:border-transparent hover:bg-blue-600 hover:text-white active:translate-y-0"
            onClick={handleOk}
          >
            Ok
          </button>
          <button
            className="transform rounded border border-red-600 bg-transparent py-2 px-4 font-semibold text-red-600 transition duration-200 ease-in hover:-translate-y-1 hover:border-transparent hover:bg-red-600 hover:text-white active:translate-y-0"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
