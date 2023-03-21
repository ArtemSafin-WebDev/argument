import Modal from "./classes/Modal";

export default function modals() {
  const callbackModal = document.querySelector<HTMLElement>("#callback-modal");
  const successModal = document.querySelector<HTMLElement>("#success-modal");

  if (callbackModal && successModal) {
    const successModalInstance = new Modal(successModal, {
      openBtns: [],
    });
    const callbackModalInstance = new Modal(callbackModal, {
      openBtns: Array.from(
        document.querySelectorAll<HTMLElement>(".js-open-callback-modal")
      ),
      onFormSend: () => {
        callbackModalInstance.closeModal();
        setTimeout(() => {
          successModalInstance.openModal();
        }, 400);
      },
    });
  }
}
