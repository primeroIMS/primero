import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import { getIDPToken } from "../login/components/idp-selection/auth-provider";
import { getUseIdentityProvider } from "../login/selectors";
import { useMemoizedSelector } from "../../libs";

function Component({ src, alt, className }) {
  const [imagesString, setImagesString] = useState("");
  const isIDP = useMemoizedSelector(state => getUseIdentityProvider(state));

  const getBase64Image = async res => {
    const blob = await res.blob();

    const reader = new FileReader();

    await new Promise((resolve, reject) => {
      reader.onload = resolve;
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    return reader.result;
  };

  async function fetchImage() {
    const token = await getIDPToken();

    fetch(src, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(getBase64Image)
      .then(imgString => setImagesString(imgString));
  }

  useEffect(() => {
    if (isIDP) {
      fetchImage();
    }
  }, []);

  return <img src={isIDP ? imagesString : src} alt={alt} className={className} data-testid="attachment" />;
}

Component.displayName = "ImageJWT";

Component.propTypes = {
  alt: PropTypes.string,
  className: PropTypes.string,
  src: PropTypes.string.isRequired
};

export default Component;
