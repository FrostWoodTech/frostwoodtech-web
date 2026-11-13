import { useMutation } from "@tanstack/react-query";
import { submitContact } from "@/client/services/contactService";

export function useSubmitContact() {
  return useMutation({ mutationFn: submitContact });
}
