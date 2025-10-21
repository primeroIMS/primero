import { useEffect } from "react";

import { useApp } from "../../application";

function waitForRef(ref) {
  return new Promise(resolve => {
    const check = () => {
      if (ref.current) return resolve(ref.current);
      requestAnimationFrame(check);

      return null;
    };

    check();
  });
}

const configuration = {
  turnstile: {
    render: ({ el, captcha, setValue }) => {
      window.turnstile.render(el, {
        sitekey: captcha.get("site_key"),
        callback: token => {
          setValue("captcha_token", token, { shouldValidate: false });
        },
        "error-callback": () => setValue("captcha_token", ""),
        "expired-callback": () => setValue("captcha_token", "")
      });
    },
    cleanup: widgetId => {
      if (window.turnstile && widgetId) window.turnstile.remove(widgetId);
    }
  }
};

function useCaptcha({ formInstance, enabled = false, ref }) {
  const { captcha } = useApp();
  const { setValue, register } = formInstance;

  useEffect(() => {
    (async () => {
      if (!captcha && !enabled) return undefined;

      const el = await waitForRef(ref);

      register("captcha_token", { required: true });

      const widgetId = configuration[captcha.get("provider")].render({ el, captcha, setValue });

      return () => {
        configuration[captcha.get("provider")].cleanup(widgetId);
      };
    })();
  }, []);
}

export default useCaptcha;
