import { useNavigate } from "react-router-dom";
import { useNewEmailFormViewModel } from "./useNewEmailFormViewModel";

export function useNewEmailViewModel() {
  const navigate = useNavigate();

  function handleSuccess() {
    navigate("/lista");
  }

  function handleCancel() {
    navigate(-1);
  }

  // Passamos handleSuccess para o form VM
  const formVM = useNewEmailFormViewModel(handleSuccess);

  return {
    ...formVM,      // form, updateField, submit, isSaving
    handleSuccess,
    handleCancel,
  };
}
