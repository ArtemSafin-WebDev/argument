import { clearAllBodyScrollLocks, disableBodyScroll } from "body-scroll-lock";
import Validator from "./Validator";
import axios from "axios";

interface Options {
  openBtns: HTMLElement[];
  onFormSend?: () => void;
  onFormFailed?: () => void;
}

class Modal {
  private closeBtns: HTMLButtonElement[];
  private open: boolean = false;
  private modal: HTMLElement;
  private openBtns: HTMLElement[];
  private form: HTMLFormElement | null;
  private formValidator: Validator | null = null;
  private options: Options;
  private controller: AbortController;
  constructor(element: HTMLElement, options: Options) {
    this.options = options;
    this.modal = element;
    this.closeBtns = Array.from(element.querySelectorAll(".js-modal-close"));
    this.openBtns = this.options.openBtns;
    this.form = element.querySelector<HTMLFormElement>("form");

    console.log("Close btns", this.closeBtns);
    this.closeBtns.forEach((btn) => {
      btn.addEventListener("click", this.handleClose);
    });

    this.controller = new AbortController();

    this.openBtns.forEach((btn) => {
      btn.addEventListener("click", this.handleOpen);
    });

    if (this.form) {
      this.formValidator = new Validator(this.form);
      this.form.addEventListener("submit", this.handleFormSubmit);
      console.log("Validator attached");
    }

    this.modal.addEventListener("click", this.handleOutsideModalClick);
  }

  private handleOutsideModalClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target === this.modal) {
      this.closeModal();
    }
  };

  private handleFormSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    if (!this.formValidator || !this.form) return;
    this.formValidator.validate();

    if (this.formValidator.valid) {
      const formData = new FormData(this.form);

      axios
        .post(this.form.action, formData, {
          signal: this.controller.signal,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);
          if (this.form) {
            this.form.reset();
            if (this.options.onFormSend) {
              this.options.onFormSend();
            }
          }
        })
        .catch((err) => {
          console.error(err);
          if (this.options.onFormFailed) {
            this.options.onFormFailed();
          }
        });
    }
  };

  private handleClose = (event: MouseEvent) => {
    console.log("Closing");
    event.preventDefault();
    this.closeModal();
  };

  private handleOpen = (event: MouseEvent) => {
    event.preventDefault();
    this.openModal();
  };

  public openModal() {
    if (this.open) return;
    disableBodyScroll(this.modal);
    this.modal.classList.add("active");
    this.open = true;
  }

  public closeModal() {
    if (!this.open) return;
    clearAllBodyScrollLocks();
    this.modal.classList.remove("active");
    this.open = false;
    if (this.form) {
      this.form.reset();
    }
  }
}

export default Modal;
