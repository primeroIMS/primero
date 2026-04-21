/* eslint-disable camelcase */
export default (target, source, options) => {
  if (target.some(elem => options.isMergeableObject(elem)) || source.some(elem => options.isMergeableObject(elem))) {
    const missingSubformElems = target.filter(targetItem => {
      return targetItem?.id
        ? !source.some(sourceItem => targetItem.id === sourceItem?.id)
        : !source.some(sourceItem => targetItem?.unique_id === sourceItem?.unique_id);
    });

    const missingAttachmentElems = target.filter(targetItem => {
      return (
        targetItem?.attachment &&
        !source.some(
          sourceItem => targetItem.attachment === sourceItem?.attachment && targetItem.file_name && sourceItem.file_name
        )
      );
    });

    return missingSubformElems.concat(missingAttachmentElems).concat(source);
  }

  return source;
};
