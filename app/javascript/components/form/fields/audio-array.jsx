import { AssetJwt } from "../../asset-jwt";

/* eslint-disable jsx-a11y/media-has-caption */

const AudioArray = ({ attachments }) => {
  return attachments.map(attachment => (
    <div key={attachment.id}>
      <AssetJwt id={attachment.file_name} src={attachment.attachment_url} type="audio" />
    </div>
  ));
};

AudioArray.displayName = "AudioArray";

export default AudioArray;
