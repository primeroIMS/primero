// eslint-disable-next-line max-classes-per-file
const bufferAvailable = typeof global.Buffer !== "undefined";

if (typeof global.TextEncoder === "undefined" && bufferAvailable) {
  class JsPDFTextEncoder {
    // eslint-disable-next-line class-methods-use-this
    encode(input) {
      return Buffer.from(String(input === 0 ? "" : input), "utf-8");
    }
  }

  global.TextEncoder = JsPDFTextEncoder;
}

if (typeof global.TextDecoder === "undefined" && bufferAvailable) {
  class JsPDFTextDecoder {
    constructor(encoding) {
      this.encoding = encoding || "utf-8";
    }

    decode(input) {
      if (input == null) {
        return "";
      }

      let buffer;

      if (Buffer.isBuffer(input)) {
        buffer = input;
      } else if (input instanceof ArrayBuffer) {
        buffer = Buffer.from(input);
      } else if (ArrayBuffer.isView(input)) {
        buffer = Buffer.from(input.buffer, input.byteOffset, input.byteLength);
      } else if (Array.isArray(input)) {
        buffer = Buffer.from(input);
      } else {
        throw new TypeError("The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");
      }

      return buffer.toString(this.encoding);
    }
  }

  global.TextDecoder = JsPDFTextDecoder;
}
