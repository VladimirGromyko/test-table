
import { toast } from 'vue3-toastify';

/**
 * @param message {string} - Message text
 * @param type {('success'|'info'|'warning'|'error'|'default')} - Type notification window
 * @param [options=undefined] {object} - Toastify options, {@link https://github.com/Maronato/vue-toastification/tree/main#api}
 * @return any
 */
export const Toastify = (message: string = "", type: string = "default", options?: any) => {
  debugger
  let textMessage = message;
  if (Array.isArray(message)) {
    textMessage = message.join(" ");
  }
  if (type === "default") return toast(textMessage, options);
  // if (type === "error") return toast[type](textMessage, { ...options, timeout: 15000 });
  if (type === "error") return toast[type](textMessage, { ...options, theme: 'colored', position: toast.POSITION.BOTTOM_RIGHT });
  return toast[type](textMessage, options);
};