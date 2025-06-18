import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import { getIDPToken } from "../login/components/idp-selection/auth-provider";
import { getUseIdentityProvider } from "../login/selectors";
import { useMemoizedSelector } from "../../libs";

function Component({ src, alt, className, type = "image", id }) {
  const [srcString, setSrcString] = useState("");
  const isIDP = useMemoizedSelector(state => getUseIdentityProvider(state));

  const isBase64 = src?.startsWith("data:");

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
      .then(output => setSrcString(output));
  }

  useEffect(() => {
    if (isIDP) {
      fetchImage();
    }
  }, [src, isIDP, isBase64]);

  if (type === "audio") {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <audio id={id} controls data-testid="audio" src={isIDP && !isBase64 ? srcString : src} />
    );
  }

  return <img src={isIDP && !isBase64 ? srcString : src} alt={alt} className={className} data-testid="attachment" />;
}

Component.displayName = "AssetJWT";

Component.propTypes = {
  alt: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  src: PropTypes.string.isRequired,
  type: PropTypes.string
};

export default Component;
