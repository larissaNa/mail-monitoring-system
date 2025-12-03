import { useNavigate } from "react-router-dom";

export function useNewEmailViewModel() {
  const navigate = useNavigate();

  function handleSuccess() {
    navigate("/lista");
  }

  function handleCancel() {
    navigate(-1);
  }

  return {
    handleSuccess,
    handleCancel,
  };
}
