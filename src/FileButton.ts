import { createRef, ref } from "lit/directives/ref.js";
import { Button, type ButtonProps } from "./Button.js";
import { html } from "./mini.js";

export interface FileButtonProps extends Omit<ButtonProps, "onClick"> {
   accept?: string;
   multiple?: boolean;
   maxFileSize?: number;
   onFilesSelected?: (files: File[]) => void;
}

export const FileButton = ({
   accept = "*",
   multiple = false,
   maxFileSize,
   onFilesSelected,
   disabled = false,
   loading = false,
   ...buttonProps
}: FileButtonProps) => {
   const inputRef = createRef<HTMLInputElement>();

   const handleFileChange = (e: Event) => {
      const input = e.target as HTMLInputElement;
      const files = Array.from(input.files || []);

      if (maxFileSize) {
         const validFiles = files.filter((file) => {
            if (file.size > maxFileSize) {
               console.warn(`File ${file.name} exceeds maximum size of ${maxFileSize} bytes`);
               return false;
            }
            return true;
         });
         if (validFiles.length > 0) {
            onFilesSelected?.(validFiles);
         }
      } else {
         if (files.length > 0) {
            onFilesSelected?.(files);
         }
      }

      // Reset input so same file can be selected again
      input.value = "";
   };

   return html`
      <label class="inline-block">
         <input
            type="file"
            class="sr-only"
            accept="${accept}"
            ?multiple="${multiple}"
            ?disabled="${disabled || loading}"
            @change="${handleFileChange}"
            ${ref(inputRef)}
         />
         ${Button({
            ...buttonProps,
            disabled: disabled || loading,
            loading,
            onClick: (e: Event) => {
               // Prevent label from triggering click
               e.preventDefault();
               inputRef.value?.click();
            },
         })}
      </label>
   `;
};
