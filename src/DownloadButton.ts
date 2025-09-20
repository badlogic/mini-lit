import { html, type TemplateResult } from "lit";
import { Download } from "lucide";
import { Button, type ButtonProps } from "./Button.js";
import { i18n } from "./i18n.js";
import { type IconSize, icon } from "./icons.js";

export interface DownloadButtonProps {
   content: string | Uint8Array;
   filename: string;
   mimeType?: string;
   title?: string;
   showText?: boolean;
   size?: ButtonProps["size"];
   variant?: ButtonProps["variant"];
   iconSize?: IconSize;
   isBase64?: boolean;
}

export function DownloadButton({
   content,
   filename,
   mimeType = "text/plain",
   title = i18n("Download"),
   showText = false,
   size = "sm",
   variant = "ghost",
   iconSize = "sm",
   isBase64 = false,
}: DownloadButtonProps): TemplateResult {
   const handleDownload = () => {
      let blobContent: BlobPart;

      if (content instanceof Uint8Array) {
         blobContent = content.buffer.slice(content.byteOffset, content.byteOffset + content.byteLength) as ArrayBuffer;
      } else if (typeof content === "string") {
         // Check if it's base64
         const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
         const isBase64String =
            isBase64 || (content.length >= 4 && content.length % 4 === 0 && base64Regex.test(content));

         if (isBase64String) {
            try {
               const binaryString = atob(content);
               const bytes = new Uint8Array(binaryString.length);
               for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
               }
               blobContent = bytes;
            } catch {
               // If base64 decode fails, treat as plain text
               blobContent = content;
            }
         } else {
            blobContent = content;
         }
      } else {
         blobContent = "";
      }

      const blob = new Blob([blobContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
   };

   return Button({
      variant,
      size,
      onClick: handleDownload,
      title,
      children: html` ${icon(Download, iconSize)} ${showText ? html`<span>${i18n("Download")}</span>` : ""} `,
   });
}
