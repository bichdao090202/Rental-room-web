import { FIREBASE_AUTH } from "./firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber, AuthError } from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    recaptchaWidgetId?: number;
    grecaptcha?: any; 
  }
}

const recreateRecaptchaVerifier = async (): Promise<void> => {
  window.recaptchaVerifier = new RecaptchaVerifier(FIREBASE_AUTH, "recaptcha", {
    size: "invisible",
  });
  await window.recaptchaVerifier.render().then((widgetId) => {
    window.recaptchaWidgetId = widgetId;
  });
};

const handleVertifi = async (inputPhone: string): Promise<any> => {
  try {
    if (!window.recaptchaVerifier) {
      await recreateRecaptchaVerifier();
    } else {
      await window.grecaptcha.reset(window.recaptchaWidgetId!); 
    }
    return await signInWithPhoneNumber(
      FIREBASE_AUTH,
      inputPhone,
      window.recaptchaVerifier
    );
  } catch (error) {
    console.log(error);
    if ((error as AuthError).code === "auth/too-many-requests") {
      alert("Quá nhiều yêu cầu. Vui lòng thử lại sau.");
    } else if ((error as Error).message.includes("auth/invalid-phone-number")) {
      alert("Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.");
    } else if ((error as Error).message.includes("No reCAPTCHA clients exist")) {
      alert("Không tìm thấy reCAPTCHA. Vui lòng thử tải lại trang lại sau.");
    } else if (
      (error as Error).message.includes("reCAPTCHA client element has been removed")
    ) {
      await recreateRecaptchaVerifier();
      return await signInWithPhoneNumber(
        FIREBASE_AUTH,
        inputPhone,
        window.recaptchaVerifier
      );
    } else if ((error as AuthError).code === "auth/quota-exceeded") {
      alert(
        "Quá hạn ngạch của dịch vụ xác thực. hiện tại không thể thực hiện trong khoản thời gian này"
      );
    }
  }
};

export { handleVertifi };
