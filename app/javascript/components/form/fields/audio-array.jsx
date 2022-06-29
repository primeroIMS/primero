/* eslint-disable jsx-a11y/media-has-caption */

const AudioArray = ({ attachments }) => {
  return attachments.map(attachment => (
    <div key={attachment.id}>
      <audio id={attachment.file_name} controls>
        <source src={attachment.attachment_url} />
      </audio>
    </div>
  ));
};

AudioArray.displayName = "AudioArray";

export default AudioArray;
