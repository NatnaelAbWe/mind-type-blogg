// Importing tools
import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Link from "@editorjs/link";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import axios from "axios";

const uploadImageByUrl = async (url) => {
  return {
    success: 1,
    file: { url },
  };
};

// 🔹 Upload image by File
const uploadImageByFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("http://localhost:3000/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: 1,
      file: {
        url: res.data.url,
      },
    };
  } catch (err) {
    console.error("File upload failed:", err);
    return { success: 0 };
  }
};

export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByUrl,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading...",
      levels: [2, 3],
      defaultLevel: 2,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker: Marker,
  inlineCode: InlineCode,
};
